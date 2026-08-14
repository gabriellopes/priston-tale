// ==========================================
// CONFIGURAÇÕES GERAIS E API
// ==========================================
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api/v1'
  : 'https://seu-backend.onrender.com/api/v1';

let carrinho_count = 0;

// Carregador dinâmico de componentes HTML
async function carregar_componentes() {
  const componentes = [
    'pages/cadastro/booster.html',
    'pages/cadastro/cliente.html',
    'pages/auth/modal_auth.html'
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