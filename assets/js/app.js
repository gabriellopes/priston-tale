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
