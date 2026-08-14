import mercadopago

class MercadoPagoService:
    def __init__(self, access_token: str):
        self.sdk = mercadopago.SDK(access_token)

    def criar_pix_custodia(self, valor: float, descricao: str, email_cliente: str):
        # ⚠️ APENAS PARA A PROVA DE FOGO: Força R$ 0,01 na chamada da API
        # Em produção final, deletar a conseguinte linha
        valor = 0.01

        payment_data = {
            "transaction_amount": valor,
            "description": descricao,
            "payment_method_id": "pix",
            "payer": {
                "email": email_cliente,
                "first_name": "Cliente",
                "last_name": "Priston"
            }
        }

        result = self.sdk.payment().create(payment_data)
        payment = result["response"]

        if result["status"] == 201:
            return {
                "id": payment["id"],
                "status": payment["status"],
                "qr_code": payment["point_of_interaction"]["transaction_data"]["qr_code"],
                "qr_code_base64": payment["point_of_interaction"]["transaction_data"]["qr_code_base64"]
            }
        else:
            raise Exception(f"Erro ao gerar PIX no Mercado Pago: {result}")