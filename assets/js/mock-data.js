// Dados simulados de Serviços
const mockServicos = [
  {
    id: 'lvl-up',
    titulo: 'Level Up',
    descricao: 'Upe seu personagem do nível que estiver até onde quiser com PT fixa e segura.',
    precoInicial: 'R$ 0,60 por nível',
    tag: 'Popular',
    icone: '⚔️'
  },
  {
    id: 'quests',
    titulo: 'Quests / Tiers',
    descricao: 'Completação de todas as quests de classe, Tier 3, Tier 4 e quests de rank.',
    precoInicial: 'A partir de R$ 29,90',
    tag: 'Essencial',
    icone: '📜'
  },
  {
    id: 'farming',
    titulo: 'Farming / Gold',
    descricao: 'Farm intensivo de gold, itens de craft, mana e recursos em mapas de alto nível.',
    precoInicial: 'A partir de R$ 19,90',
    tag: 'Recursos',
    icone: '💰'
  },
  {
    id: 'evento',
    titulo: 'Eventos Especiais',
    descricao: 'Aproveite os finais de semana de XP 2x ou eventos de feriado sem perder tempo.',
    precoInicial: 'Consulte valores',
    tag: 'Limitado',
    icone: '🔥'
  }
];

// Dados simulados de Vendedores em Destaque (Boosters)
const mockVendedores = [
  {
    id: 'vendedor-1',
    nick: 'LordPike',
    classe: 'Pike / Lutador',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    avaliacao: 5.0,
    avaliacoesCount: 324,
    prazoMedio: '2 dias',
    precoPorNivel: 'R$ 0,55 / nível',
    verificado: true
  },
  {
    id: 'vendedor-2',
    nick: 'xMagoBrabo',
    classe: 'Mago / Sacerdotisa',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    avaliacao: 4.9,
    avaliacoesCount: 211,
    prazoMedio: '3 dias',
    precoPorNivel: 'R$ 0,60 / nível',
    verificado: true
  },
  {
    id: 'vendedor-3',
    nick: 'UpaNoturno',
    classe: 'Atalanta / Cavaleiro',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    avaliacao: 5.0,
    avaliacoesCount: 178,
    prazoMedio: '1 dia',
    precoPorNivel: 'R$ 0,70 / nível',
    verificado: true
  },
  {
    id: 'vendedor-4',
    nick: 'OldSchoolPT',
    classe: 'Lutador / Arqueira',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    avaliacao: 4.9,
    avaliacoesCount: 152,
    prazoMedio: '2 dias',
    precoPorNivel: 'R$ 0,58 / nível',
    verificado: true
  },
  {
    id: 'vendedor-5',
    nick: 'SabaoDeP1k4',
    classe: 'Pike / Lutador',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWwuo2jvb6xCupv5YrNpL3qtsn8C9v_YwMP45F0hNEBA&s=10',
    avaliacao: 2.7,
    avaliacoesCount: 853,
    prazoMedio: '3 dias',
    precoPorNivel: 'R$ 0,65 / nível',
    verificado: true
  }
];
