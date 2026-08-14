// ==========================================
// RENDERIZAÇÃO DE SERVIÇOS E PRESTADORES
// ==========================================
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
    
    // Suporta tanto id="gridPrestadores" quanto "grid-prestadores"
    const container = document.getElementById('gridPrestadores') || document.getElementById('grid-prestadores');
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