export const CATEGORIAS = [
  { id: '1', emoji: '🍝', label: 'Massas' },
  { id: '2', emoji: '🥩', label: 'Carnes' },
  { id: '3', emoji: '🥗', label: 'Saladas' },
  { id: '4', emoji: '🍮', label: 'Sobremesas' },
  { id: '5', emoji: '🥤', label: 'Bebidas' },
  { id: '6', emoji: '☕', label: 'Café da manhã' },
];

export const FILTROS_RAPIDOS = ['Hoje', 'Rápido', 'Saudável'];

export const RECEITAS_DESTAQUE = [
  {
    id: '1',
    titulo: 'Nhoque ao molho rústico',
    tempo: '35 min',
    imagem: 'https://images.unsplash.com/photo-1774828893338-50fd6c5f3062?w=780&h=560&fit=crop&auto=format',
    avaliacao: 4.9,
    avaliacoesCount: 312,
    dificuldade: 'Fácil',
    porcoes: 4,
    descricao:
      'Um prato simples e reconfortante que traz o sabor do campo italiano para a sua mesa. O molho rústico de tomate, perfumado com manjericão e alho, abraça cada pedacinho do nhoque macio.',
    ingredientes: [
      { qtd: 500, unidade: 'g', nome: 'Nhoque de batata fresco' },
      { qtd: 400, unidade: 'g', nome: 'Tomates pelados em lata' },
      { qtd: 1, unidade: 'un.', nome: 'Cebola média picada' },
      { qtd: 3, unidade: 'dentes', nome: 'Alho amassado' },
      { qtd: 4, unidade: 'colh. sopa', nome: 'Azeite de oliva extra virgem' },
      { qtd: 1, unidade: 'punhado', nome: 'Manjericão fresco' },
      { qtd: 'a gosto', unidade: '', nome: 'Sal e pimenta-do-reino' },
      { qtd: 50, unidade: 'g', nome: 'Parmesão ralado para servir' },
    ],
    passos: [
      'Aqueça o azeite em uma frigideira larga e doure a cebola picada em fogo médio por cerca de 5 minutos.',
      'Adicione o alho amassado e refogue por mais 1 minuto, mexendo sempre.',
      'Acrescente os tomates pelados e amasse-os. Cozinhe em fogo baixo por 20 minutos.',
      'Em outra panela, cozinhe o nhoque em água fervente com sal até subir à superfície.',
      'Misture o nhoque delicadamente com o molho e finalize com manjericão e parmesão.',
    ],
    dicas: [
      'Use nhoque fresco — faz toda a diferença no resultado final.',
      'Não deixe o molho ferver forte; fogo baixo preserva o sabor dos tomates.',
    ],
    historia: 'O nhoque tem raízes profundas no norte da Itália, especialmente no Vêneto e na Lombardia.',
  },
  {
    id: '2',
    titulo: 'Frango cremoso com ervas',
    tempo: '40 min',
    imagem: 'https://images.unsplash.com/photo-1636044992970-f6efe88ab1f8?w=780&h=560&fit=crop&auto=format',
    avaliacao: 4.7,
    avaliacoesCount: 180,
    dificuldade: 'Média',
    porcoes: 3,
    descricao: 'Peito de frango suculento envolvido em um molho cremoso de creme de leite e ervas finas.',
    ingredientes: [
      { qtd: 600, unidade: 'g', nome: 'Peito de frango em cubos' },
      { qtd: 200, unidade: 'g', nome: 'Creme de leite' },
      { qtd: 2, unidade: 'colh. sopa', nome: 'Ervas finas frescas' },
    ],
    passos: [
      'Tempere o frango com sal e pimenta.',
      'Grelhe os cubos de frango até dourarem.',
      'Adicione o creme de leite e as ervas, deixando reduzir em fogo baixo.',
    ],
  },
  {
    id: '3',
    titulo: 'Risoto de cogumelos',
    tempo: '45 min',
    imagem: 'https://images.unsplash.com/photo-1609770424775-39ec362f2d94?w=780&h=560&fit=crop&auto=format',
    avaliacao: 4.8,
    avaliacoesCount: 240,
    dificuldade: 'Média',
    porcoes: 2,
    descricao: 'Risoto cremoso feito com arroz arbóreo, cogumelos shimeji e queijo parmesão.',
    ingredientes: [
      { qtd: 200, unidade: 'g', nome: 'Arroz Arbóreo' },
      { qtd: 250, unidade: 'g', nome: 'Cogumelos variados' },
      { qtd: 1, unidade: 'litro', nome: 'Caldo de legumes' },
    ],
    passos: [
      'Refogue os cogumelos na manteiga e reserve.',
      'Refogue a cebola, adicione o arroz e vá colocando o caldo de legumes aos poucos.',
      'Quando o arroz estiver al dente, incorpore os cogumelos e o queijo parmesão.',
    ],
  },
];

export const RECEITAS_SUGERIDAS = [
  {
    id: '4',
    titulo: 'Macarrão ao pesto',
    tempo: '20 min',
    imagem: 'https://images.unsplash.com/photo-1625943554275-826250826b2f?w=400&h=280&fit=crop&auto=format',
  },
  {
    id: '5',
    titulo: 'Salmão grelhado',
    tempo: '25 min',
    imagem: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400&h=280&fit=crop&auto=format',
  },
  {
    id: '6',
    titulo: 'Bowl de salada',
    tempo: '15 min',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&auto=format',
  },
  {
    id: '7',
    titulo: 'Lasanha assada',
    tempo: '60 min',
    imagem: 'https://images.unsplash.com/photo-1586197138382-e1d1479fbb14?w=400&h=280&fit=crop&auto=format',
  },
];