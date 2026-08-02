import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Tabela Prestadores/Boosters (Já tínhamos)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prestadores (
            id TEXT PRIMARY KEY,
            nick TEXT NOT NULL,
            classe TEXT NOT NULL,
            avatar TEXT,
            whatsapp TEXT,
            chave_pix TEXT,
            preco_por_nivel REAL,
            prazo_medio TEXT,
            avaliacao REAL DEFAULT 5.0,
            avaliacoes_count INTEGER DEFAULT 0,
            verificado BOOLEAN DEFAULT 0
        )
    ''')
    
    # Tabela Clientes (NOVA)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            whatsapp TEXT NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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