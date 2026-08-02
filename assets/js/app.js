// ==========================================
// CONFIGURAÇÕES GERAIS E API
// ==========================================
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api/v1'
  : 'https://seu-backend.onrender.com/api/v1'; // URL futura de prod

let carrinho_count = 0;

// ==========================================
// CALCULADORA DE SERVIÇOS
// ==========================================
function calcular_preco() {
  const do_nivel = parseInt(document.getElementById('doNivel')?.value) || 0;
  const ate_nivel = parseInt(document.getElementById('ateNivel')?.value) || 0;
  const btn_ativo = document.querySelector('.option-btn.active');
  const fator_prazo = btn_ativo ? parseFloat(btn_ativo.dataset.fator) : 1.0;

  const diferenca_nivel = ate_nivel - do_nivel;

  if (diferenca_nivel > 0) {
    const preco_base_por_nivel = 3.50;
    const total = diferenca_nivel * preco_base_por_nivel * fator_prazo;
    document.getElementById('valorEstimado').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  } else {
    document.getElementById('valorEstimado').innerText = 'R$ 0,00';
  }
}

function adicionar_ao_carrinho() {
  carrinho_count++;
  const badge = document.getElementById('cartBadge');
  if (badge) badge.innerText = carrinho_count;
  
  const btn = document.getElementById('btnAdicionar');
  if (btn) {
    btn.innerText = "✓ Adicionado ao Carrinho!";
    btn.classList.replace('btn-gold', 'btn-success');
    
    setTimeout(() => {
      btn.innerText = "Ver vendedores disponíveis";
      btn.classList.replace('btn-success', 'btn-gold');
    }, 2000);
  }
}

function selecionar_servico(id) {
  alert(`Serviço [${id}] selecionado! Rolando para a calculadora...`);
  document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// RENDERIZAÇÃO E INTEGRAÇÃO DE COMPONENTES
// ==========================================
async function carregar_componentes() {
  const componentes = [
    'components/modal_cadastro_booster.html',
    'components/modal_cadastro_cliente.html'
  ];

  for (const comp of componentes) {
    try {
      const res = await fetch(comp);
      if (res.ok) {
        const html = await res.text();
        document.body.insertAdjacentHTML('beforeend', html);
      }
    } catch (err) {
      console.error(`Erro ao carregar componente ${comp}:`, err);
    }
  }
}

function renderizar_servicos() {
  const container = document.getElementById('grid-servicos');
  if (!container || typeof mockServicos === 'undefined') return;

  container.innerHTML = mockServicos.map(s => `
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="card bg-card card-service h-100 p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="display-4">${s.icone}</span>
          <span class="badge badge-warning font-weight-bold px-2 py-1">${s.tag}</span>
        </div>
        <h5 class="font-weight-bold text-light">${s.titulo}</h5>
        <p class="text-muted small flex-grow-1">${s.descricao}</p>
        <div class="border-top border-dark-custom pt-3 mt-2 d-flex justify-content-between align-items-center">
          <div>
            <small class="text-muted d-block">A partir de</small>
            <strong class="text-gold">${s.precoInicial}</strong>
          </div>
          <button class="btn btn-sm btn-outline-gold" onclick="selecionar_servico('${s.id}')">➔</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function carregar_prestadores_reais() {
  try {
    const res = await fetch(`${API_URL}/prestadores`);
    const prestadores = await res.json();
    
    const container = document.getElementById('gridPrestadores');
    if (!container) return;
    
    container.innerHTML = prestadores.map(p => `
      <div class="col-md-3 mb-4">
        <div class="card bg-card text-light border-dark-custom h-100">
          <div class="card-body text-center">
            <img src="${p.avatar}" class="rounded-circle mb-3" style="width: 80px; height: 80px; object-fit: cover;">
            <h5 class="font-weight-bold text-gold mb-1">${p.nick}</h5>
            <p class="small text-muted mb-2">${p.classe}</p>
            <p class="small text-warning">★ ${p.avaliacao} (${p.avaliacoesCount})</p>
            <div class="d-flex justify-content-between small text-muted my-2">
              <span>Prazo: ${p.prazoMedio}</span>
              <span class="text-light font-weight-bold">${p.precoPorNivel}</span>
            </div>
            <button onclick="contratar_vendedor('${p.id}')" class="btn btn-gold btn-block font-weight-bold btn-sm mt-3">
              Contratar Booster
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar boosters do backend:', err);
  }
}

// ==========================================
// HANDLERS DE CADASTRO
// ==========================================
async function cadastrar_novo_booster(event) {
  event.preventDefault();

  const payload = {
    nick: document.getElementById('boosterNick').value,
    email: document.getElementById('boosterEmail').value,
    whatsapp: document.getElementById('boosterWhatsapp').value,
    classe: document.getElementById('boosterClasse').value
  };

  try {
    const res = await fetch(`${API_URL}/prestadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.sucesso) {
      alert('Booster cadastrado com sucesso! Perfil adicionado à vitrine.');
      $('#modalCadastroBooster').modal('hide');
      document.getElementById('formCadastroBooster').reset();
      
      carregar_prestadores_reais();
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
  }
}

async function cadastrar_novo_cliente(event) {
  event.preventDefault();

  const clienteEmail = document.getElementById('clienteEmail').value;
  localStorage.setItem('cliente_email', clienteEmail);

  alert(`Cliente registrado com sucesso! E-mail [${clienteEmail}] salvo para as compras.`);
  $('#modalCadastroCliente').modal('hide');
  document.getElementById('formCadastroCliente').reset();
}

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
      valor: 0.01, // Valor de teste dinâmico no backend
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
    alert('Não foi possível conectar com o servidor Python. O Uvicorn está rodando?');
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
    // Rota de escuta/status do pagamento
  }, 3000);
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA (SINGLE LISTENERS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  carregar_componentes();
  renderizar_servicos();
  carregar_prestadores_reais();

  // Listeners dos seletores da calculadora
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      calcular_preco();
    });
  });

  document.getElementById('doNivel')?.addEventListener('input', calcular_preco);
  document.getElementById('ateNivel')?.addEventListener('input', calcular_preco);
});