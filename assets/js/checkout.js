// ==========================================
// FLUXO DE CHECKOUT E ESCROW (PIX)
// ==========================================
async function contratar_vendedor(boosterId) {
  try {
    $('#pixModal').modal('show');
    document.getElementById('pixLoading')?.classList.remove('d-none');
    document.getElementById('pixContent')?.classList.add('d-none');

    const emailCliente = localStorage.getItem('cliente_email') || "cliente@priston.com";

    const payload = {
      booster_id: boosterId,
      valor: 0.01,
      email_cliente: emailCliente
    };

    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.sucesso) {
      document.getElementById('qrCodeImg').src = `data:image/png;base64,${data.qr_code_base64}`;
      document.getElementById('pixCopiaCola').value = data.qr_code;
      
      iniciar_polling_pagamento(data.pagamento_id);

      document.getElementById('pixLoading')?.classList.add('d-none');
      document.getElementById('pixContent')?.classList.remove('d-none');
    } else {
      alert('Erro ao gerar PIX. Verifique os logs do backend.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Não foi possível conectar com o servidor Python.');
  }
}

function copiar_pix() {
  const copyText = document.getElementById("pixCopiaCola");
  if (copyText) {
    copyText.select();
    document.execCommand("copy");
    alert("Código Pix copiado para a área de transferência!");
  }
}

function iniciar_polling_pagamento(paymentId) {
  const interval = setInterval(async () => {
    // Futura consulta de status
  }, 3000);
}