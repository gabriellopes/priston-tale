import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Tabela de Prestadores (Grade + Pagamento)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prestadores (
            id TEXT PRIMARY KEY,
            nick TEXT NOT NULL,
            classe TEXT NOT NULL,
            avatar TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            chave_pix TEXT NOT NULL,
            preco_por_nivel REAL NOT NULL,
            prazo_medio TEXT NOT NULL,
            avaliacao REAL DEFAULT 5.0,
            avaliacoes_count INTEGER DEFAULT 0,
            verificado BOOLEAN DEFAULT 1
        )
    ''')
    
    # Tabela de Pedidos (Custódia/Escrow)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id TEXT PRIMARY KEY,
            cliente_email TEXT NOT NULL,
            booster_id TEXT NOT NULL,
            valor REAL NOT NULL,
            status TEXT NOT NULL, -- PENDENTE, RETIDO_EM_CUSTODIA, PRINT_ENVIADO, CONCLUIDO
            print_url TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def get_connection():
    return sqlite3.connect(DB_PATH)