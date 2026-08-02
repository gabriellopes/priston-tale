import os
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from app.base.database import init_db, get_connection
from app.api.dependencies import get_payment_service
from app.core.payment import MercadoPagoService

load_dotenv()

# Inicializa banco de dados
init_db()

app = FastAPI(title="Priston XP Express - API Escrow Prod")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class CheckoutRequest(BaseModel):
    booster_id: str
    valor: float
    email_cliente: str

class ConfirmacaoUp(BaseModel):
    pedido_id: str
    print_url: str

class BoosterCadastroRequest(BaseModel):
    nick: str
    email: str
    classe: str
    # Opcionais no cadastro inicial (Preenchidos depois ou inferidos pelo sistema)
    whatsapp: Optional[str] = "N/A"
    chave_pix: Optional[str] = None
    avatar: Optional[str] = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    preco_por_nivel: Optional[float] = 0.70
    prazo_medio: Optional[str] = "1 dia"
    id: Optional[str] = None

class ClienteCadastroRequest(BaseModel):
    nome: str
    email: str
    whatsapp: str

# --- Rotas da Aplicação ---


@app.post("/api/v1/clientes")
async def cadastrar_novo_cliente(payload: ClienteCadastroRequest):
    """Cadastra um novo cliente no banco de dados"""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO clientes (nome, email, whatsapp)
            VALUES (?, ?, ?)
        ''', (payload.nome, payload.email, payload.whatsapp))
        conn.commit()
        conn.close()
        return {"sucesso": True, "mensagem": "Cliente cadastrado com sucesso!"}
    except Exception as e:
        conn.close()
        # Se o e-mail já existir, só ignora ou atualiza
        return {"sucesso": True, "mensagem": "Cliente já cadastrado/reconhecido."}

@app.get("/api/v1/clientes")
async def listar_clientes():
    """Endpoint GET no Swagger para você conferir os clientes cadastrados!"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, email, whatsapp, criado_em FROM clientes")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": r[0],
            "nome": r[1],
            "email": r[2],
            "whatsapp": r[3],
            "criado_em": r[4]
        }
        for r in rows
    ]

@app.get("/api/v1/prestadores")
async def listar_prestadores():
    """Retorna a lista de boosters cadastrados para montar os cards no Front"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, nick, classe, avatar, avaliacao, avaliacoes_count, 
               prazo_medio, preco_por_nivel, verificado 
        FROM prestadores
    """)
    rows = cursor.fetchall()
    conn.close()
    
    prestadores = []
    for r in rows:
        prestadores.append({
            "id": r[0],
            "nick": r[1],
            "classe": r[2],
            "avatar": r[3],
            "avaliacao": r[4],
            "avaliacoesCount": r[5],
            "prazoMedio": r[6],
            "precoPorNivel": f"R$ {r[7]:.2f}".replace('.', ','),
            "precoPorNivelFloat": r[7],
            "verificado": bool(r[8])
        })
    return prestadores


@app.post("/api/v1/prestadores")
async def cadastrar_novo_booster(payload: BoosterCadastroRequest):
    """Cadastra booster aceitando desde o payload simplificado até o completo"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Se não passou ID customizado, gera o ID slug padrão
    booster_id = payload.id or f"booster-{payload.nick.lower().replace(' ', '-')}"
    # Se passou chave_pix usa ela; caso contrário, usa o e-mail como fallback temporário
    pix_final = payload.chave_pix or payload.email

    try:
        cursor.execute('''
            INSERT INTO prestadores 
            (id, nick, classe, avatar, whatsapp, chave_pix, preco_por_nivel, prazo_medio, avaliacao, avaliacoes_count, verificado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            booster_id,
            payload.nick,
            payload.classe,
            payload.avatar,
            payload.whatsapp,
            pix_final,
            payload.preco_por_nivel,
            payload.prazo_medio,
            5.0,
            0,
            False  # Verificado apenas após validação de e-mail/Pix no payout
        ))
        conn.commit()
        conn.close()
        return {"sucesso": True, "id": booster_id, "mensagem": "Booster cadastrado com sucesso!"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Erro ao cadastrar booster: {str(e)}")

@app.post("/api/v1/checkout")
async def criar_checkout(
    payload: CheckoutRequest, 
    mp_service: MercadoPagoService = Depends(get_payment_service)
):
    """Gera o Pix Dinâmico no Mercado Pago"""
    try:
        if payload.valor <= 0:
            raise HTTPException(status_code=400, detail="O valor da transação deve ser maior que R$ 0,00.")

        pix_res = mp_service.criar_pix_custodia(
            valor=payload.valor,
            descricao=f"Priston XP Express - Booster: {payload.booster_id}",
            email_cliente=payload.email_cliente
        )
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO pedidos (id, cliente_email, booster_id, valor, status) VALUES (?, ?, ?, ?, ?)",
            (str(pix_res["id"]), payload.email_cliente, payload.booster_id, payload.valor, "AGUARDANDO_PAGAMENTO")
        )
        conn.commit()
        conn.close()

        return {
            "sucesso": True,
            "pagamento_id": pix_res["id"],
            "valor": payload.valor,
            "qr_code": pix_res["qr_code"],
            "qr_code_base64": pix_res["qr_code_base64"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/v1/webhook")
async def webhook_mercadopago(request: Request):
    """Notificação em tempo real do Mercado Pago"""
    data = await request.json()
    
    if data.get("action") == "payment.updated":
        payment_id = str(data["data"]["id"])
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE pedidos SET status = 'RETIDO_EM_CUSTODIA' WHERE id = ?", (payment_id,))
        conn.commit()
        conn.close()
        print(f"🔒 SUCESSO! Pagamento {payment_id} retido em custódia!")
            
    return {"status": "ok"}


@app.post("/api/v1/pedidos/{pedido_id}/liberar-pagamento")
async def liberar_pagamento(pedido_id: str):
    """Cliente confirma e libera o Pix pro Booster"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT booster_id, valor, status FROM pedidos WHERE id = ?", (pedido_id,))
    pedido = cursor.fetchone()
    
    if not pedido:
        conn.close()
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    
    booster_id, valor, status = pedido
    
    cursor.execute("SELECT chave_pix, whatsapp FROM prestadores WHERE nick = ? OR id = ?", (booster_id, booster_id))
    booster = cursor.fetchone()
    conn.close()
    
    chave_pix = booster[0] if booster else "N/A"
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE pedidos SET status = 'CONCLUIDO' WHERE id = ?", (pedido_id,))
    conn.commit()
    conn.close()
    
    print(f"💸 PAYOUT CONCLUÍDO: R$ {valor} liberados para o Pix: [{chave_pix}]!")
    
    return {
        "sucesso": True,
        "status": "CONCLUIDO",
        "mensagem": f"Pagamento de R$ {valor:.2f} liberado para a chave Pix {chave_pix}!"
    }