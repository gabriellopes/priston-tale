// ==========================================
// CALCULADORA DE SERVIÇOS & CARRINHO
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