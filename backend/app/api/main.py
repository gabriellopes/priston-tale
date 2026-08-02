import os
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from app.core.payment import MercadoPagoService
from app.api.dependencies import get_payment_service

load_dotenv()

app = FastAPI(title="Priston XP Express - API Escrow")

# Configuração de CORS (Middlewares ficam no app principal)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckoutRequest(BaseModel):
    booster_id: str
    valor: float = 0.01
    email_cliente: str

@app.post("/api/v1/checkout")
async def criar_checkout(
    payload: CheckoutRequest, 
    mp_service: MercadoPagoService = Depends(get_payment_service) # Injeção de dependência limpa!
):
    try:
        pix_res = mp_service.criar_pix_custodia(
            valor=payload.valor,
            descricao=f"Up Priston Tale - Booster: {payload.booster_id}",
            email_cliente=payload.email_cliente
        )
        return {
            "sucesso": True,
            "pagamento_id": pix_res["id"],
            "qr_code": pix_res["qr_code"],
            "qr_code_base64": pix_res["qr_code_base64"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))