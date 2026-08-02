// Lógica da Calculadora Dinâmica estilo Compra de Passagens
let carrinhoCount = 0;

function calcularPreco() {
  const doNivel = parseInt(document.getElementById('doNivel').value) || 0;
  const ateNivel = parseInt(document.getElementById('ateNivel').value) || 0;
  const fatorPrazo = parseFloat(document.querySelector('.option-btn.active').dataset.fator);

  const diferencaNivel = ateNivel - doNivel;

  if (diferencaNivel > 0) {
    // Preço base de R$ 3,50 por nível * fator do prazo escolhido
    const precoBasePorNivel = 3.50;
    const total = diferencaNivel * precoBasePorNivel * fatorPrazo;
    document.getElementById('valorEstimado').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  } else {
    document.getElementById('valorEstimado').innerText = 'R$ 0,00';
  }
}

// Seleção de Prazo (Padrão, Expresso, Turbo)
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    calcularPreco();
  });
});

// Atualizar cálculo ao digitar níveis
document.getElementById('doNivel')?.addEventListener('input', calcularPreco);
document.getElementById('ateNivel')?.addEventListener('input', calcularPreco);

// Adicionar ao Carrinho
function adicionarAoCarrinho() {
  carrinhoCount++;
  document.getElementById('cartBadge').innerText = carrinhoCount;
  
  // Efeito simples visual
  const btn = document.getElementById('btnAdicionar');
  btn.innerText = "✓ Adicionado ao Carrinho!";
  btn.classList.replace('btn-gold', 'btn-success');
  
  setTimeout(() => {
    btn.innerText = "Ver vendedores disponíveis";
    btn.classList.replace('btn-success', 'btn-gold');
  }, 2000);
}

// Lógica de Renderização Dinâmica dos Mocks
document.addEventListener('DOMContentLoaded', () => {
  renderizarServicos();
  renderizarVendedores();
});

function renderizarServicos() {
  const container = document.getElementById('grid-servicos');
  if (!container) return;

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
          <button class="btn btn-sm btn-outline-gold" onclick="selecionarServico('${s.id}')">➔</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderizarVendedores() {
  const container = document.getElementById('grid-vendedores');
  if (!container) return;

  container.innerHTML = mockVendedores.map(v => `
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="card bg-card card-service p-3 text-center">
        <div class="position-relative d-inline-block mx-auto mb-3">
          <img src="${v.avatar}" alt="${v.nick}" class="rounded-circle border border-warning" width="80" height="80" style="object-fit: cover;">
          ${v.verificado ? '<span class="badge badge-primary position-absolute" style="bottom: 0; right: 0;">✓</span>' : ''}
        </div>
        <h5 class="font-weight-bold text-light mb-1">${v.nick}</h5>
        <p class="small text-muted mb-2">${v.classe}</p>
        <div class="mb-3">
          <span class="text-warning font-weight-bold">★ ${v.avaliacao.toFixed(1)}</span>
          <small class="text-muted">(${v.avaliacoesCount})</small>
        </div>
        <div class="bg-dark rounded p-2 mb-3 border border-dark-custom text-left small">
          <div class="d-flex justify-content-between text-muted">
            <span>Prazo médio:</span>
            <strong class="text-light">${v.prazoMedio}</strong>
          </div>
          <div class="d-flex justify-content-between text-muted">
            <span>Valor:</span>
            <strong class="text-gold">${v.precoPorNivel}</strong>
          </div>
        </div>
        <button class="btn btn-gold btn-block btn-sm font-weight-bold" onclick="contratarVendedor('${v.nick}')">
          Contratar Booster
        </button>
      </div>
    </div>
  `).join('');
}

function selecionarServico(id) {
  alert(`Serviço [${id}] selecionado! Rolando para a calculadora...`);
  document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' });
}

function contratarVendedor(nick) {
  alert(`Você selecionou o booster ${nick}! Vamos direcionar para o checkout em breve.`);
}
