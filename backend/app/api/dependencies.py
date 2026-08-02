import os
from dotenv import load_dotenv
from app.core.payment import MercadoPagoService

load_dotenv()

# Dependência para injetar o serviço do Mercado Pago nas rotas
def get_payment_service() -> MercadoPagoService:
    token = os.getenv("MERCADO_PAGO_TOKEN")
    if not token:
        raise ValueError("MERCADO_PAGO_TOKEN não configurado no .env!")
    return MercadoPagoService(token)