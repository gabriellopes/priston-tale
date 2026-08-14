// ==========================================
// APP.JS - PONTO DE ENTRADA E ORQUESTRADOR
// ==========================================

// 1. Carregador dinâmico dos componentes HTML
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
      console.error(`[App] Erro ao carregar componente ${comp}:`, err);
    }
  }
}

// 2. Event Listeners Globais da Aplicação
function registrar_event_listeners() {
  // Listeners dos botões de prazo da calculadora
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      calcular_preco();
    });
  });

  // Listeners dos inputs de nível
  document.getElementById('doNivel')?.addEventListener('input', calcular_preco);
  document.getElementById('ateNivel')?.addEventListener('input', calcular_preco);
}

// 3. Loop de Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Priston XP App inicializando...');
  
  // A) Carrega modais e HTMLs externos
  await carregar_componentes();
  
  // B) Renderiza os serviços mockados e a lista de prestadores do Backend
  renderizar_servicos();
  carregar_prestadores_reais();

  // C) Ativa os listeners da interface
  registrar_event_listeners();
  
  console.log('✅ App totalmente pronto e conectado ao backend!');
});