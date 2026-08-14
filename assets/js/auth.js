// ==========================================
// HANDLERS DE AUTENTICAÇÃO E CADASTRO
// ==========================================

// Cadastrar Booster
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
    if (res.ok && data.sucesso) {
      alert('Booster cadastrado com sucesso! Perfil adicionado à vitrine.');
      $('#modalCadastroBooster').modal('hide');
      document.getElementById('formCadastroBooster').reset();
      
      carregar_prestadores_reais();
    } else {
      alert(`Erro no cadastro: ${data.detail || 'Falha na resposta do servidor'}`);
    }
  } catch (err) {
    console.error('Erro de conexão no cadastro de booster:', err);
    alert(`Erro ao conectar com o servidor (${API_URL}/prestadores).`);
  }
}

// Cadastrar Cliente
async function cadastrar_novo_cliente(event) {
  event.preventDefault();

  const clienteNome = document.getElementById('clienteNome').value;
  const clienteEmail = document.getElementById('clienteEmail').value;
  const clienteWhatsapp = document.getElementById('clienteWhatsapp').value;

  const payload = {
    nome: clienteNome,
    email: clienteEmail,
    whatsapp: clienteWhatsapp
  };

  try {
    const res = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (res.ok && data.sucesso) {
      localStorage.setItem('cliente_email', clienteEmail);
      alert(`Cliente [${clienteNome}] registrado com sucesso!`);
      $('#modalCadastroCliente').modal('hide');
      document.getElementById('formCadastroCliente').reset();
    } else {
      alert(`Erro: ${data.detail || 'Não foi possível cadastrar o cliente.'}`);
    }
  } catch (err) {
    console.error('Erro de conexão no cadastro de cliente:', err);
    alert('Não foi possível conectar com o backend Python.');
  }
}

// Utilitários do Modal Auth
function alternarParaLogin(e) {
  if (e) e.preventDefault();
  document.getElementById('authTitle').innerText = "🔑 Acessar Conta";
  document.getElementById('authStepChoice').classList.add('d-none');
  document.getElementById('authStepLogin').classList.remove('d-none');
}

function alternarParaCadastro(e) {
  if (e) e.preventDefault();
  document.getElementById('authTitle').innerText = "🛡️ Entrar ou Cadastrar";
  document.getElementById('authStepLogin').classList.add('d-none');
  document.getElementById('authStepChoice').classList.remove('d-none');
}

function abrirModalForm(tipo) {
  $('#modalAuth').modal('hide');
  if (tipo === 'booster') {
    $('#modalCadastroBooster').modal('show');
  } else {
    $('#modalCadastroCliente').modal('show');
  }
}   