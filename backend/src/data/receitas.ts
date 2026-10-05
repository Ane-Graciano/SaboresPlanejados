import { Receita } from '../models/Receita';

export const receitas: Receita[] = [
  {
    id: '1',
    titulo: 'Nhoque ao molho rústico',
    tempo: '35 min',
    categoriaId: '1',
    isSaudavel: false,
    dataAdicao: '2026-09-01',

    imagem:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=780&h=560&fit=crop&auto=format',

    imagens: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=780&h=560&fit=crop&auto=format',
    ],

    avaliacao: 4.9,
    avaliacoesCount: 312,
    dificuldade: 'Fácil',
    porcoes: 4,

    descricao:
      'Um prato simples e reconfortante com molho rústico de tomate, manjericão e alho.',

    ingredientes: [
      {
        qtd: 500,
        unidade: 'g',
        nome: 'Nhoque de batata fresco',
      },
      {
        qtd: 400,
        unidade: 'g',
        nome: 'Tomates pelados',
      },
      {
        qtd: 1,
        unidade: 'un.',
        nome: 'Cebola média',
      },
      {
        qtd: 2,
        unidade: 'dentes',
        nome: 'Alho',
      },
      {
        qtd: 2,
        unidade: 'colheres de sopa',
        nome: 'Azeite de oliva',
      },
      {
        qtd: 10,
        unidade: 'folhas',
        nome: 'Manjericão fresco',
      },
      {
        qtd: 1,
        unidade: 'pitada',
        nome: 'Sal',
      },
      {
        qtd: 1,
        unidade: 'pitada',
        nome: 'Pimenta-do-reino',
      },
    ],

    passos: [
      'Pique a cebola e o alho.',
      'Aqueça o azeite e doure a cebola.',
      'Adicione o alho e refogue rapidamente.',
      'Acrescente os tomates pelados e cozinhe em fogo baixo.',
      'Tempere com sal e pimenta.',
      'Cozinhe o nhoque em água fervente até que ele suba à superfície.',
      'Retire o nhoque e misture ao molho.',
      'Finalize com as folhas de manjericão e sirva.',
    ],

    dicas: [
      'Não cozinhe o alho por muito tempo para evitar que ele fique amargo.',
      'O nhoque está pronto quando subir à superfície da água.',
      'Reserve um pouco da água do cozimento para ajustar a textura do molho.',
      'Finalize com manjericão fresco para preservar o aroma.',
    ],

    historia:
      'O nhoque é um prato tradicional da culinária italiana, conhecido por sua textura macia e por suas diversas versões regionais. A receita ganhou inúmeras adaptações ao redor do mundo, inclusive no Brasil.',

    chef: 'Chef Paola',
    tipoPrato: 'Massa',
    culinaria: 'Italiana',

    temas: ['conforto', 'massa'],
    estacoes: ['outono', 'inverno'],
    epocas: [],
  },

  {
    id: '2',
    titulo: 'Frango cremoso com ervas',
    tempo: '40 min',
    categoriaId: '2',
    isSaudavel: false,
    dataAdicao: '2026-09-05',

    imagem:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=780&h=560&fit=crop&auto=format',

    imagens: [
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=780&h=560&fit=crop&auto=format',
    ],

    avaliacao: 4.7,
    avaliacoesCount: 180,
    dificuldade: 'Média',
    porcoes: 3,

    descricao:
      'Peito de frango suculento envolvido em molho cremoso de ervas.',

    ingredientes: [
      {
        qtd: 600,
        unidade: 'g',
        nome: 'Peito de frango',
      },
      {
        qtd: 200,
        unidade: 'g',
        nome: 'Creme de leite',
      },
      {
        qtd: 2,
        unidade: 'dentes',
        nome: 'Alho',
      },
      {
        qtd: 1,
        unidade: 'colher de sopa',
        nome: 'Azeite de oliva',
      },
      {
        qtd: 1,
        unidade: 'colher de chá',
        nome: 'Orégano',
      },
      {
        qtd: 1,
        unidade: 'colher de chá',
        nome: 'Alecrim',
      },
      {
        qtd: 1,
        unidade: 'pitada',
        nome: 'Sal',
      },
      {
        qtd: 1,
        unidade: 'pitada',
        nome: 'Pimenta-do-reino',
      },
    ],

    passos: [
      'Corte o peito de frango em filés ou cubos.',
      'Tempere o frango com sal, pimenta e ervas.',
      'Aqueça o azeite em uma frigideira.',
      'Grelhe o frango até dourar dos dois lados.',
      'Adicione o alho e refogue rapidamente.',
      'Acrescente o creme de leite.',
      'Misture bem e cozinhe em fogo baixo.',
      'Finalize com as ervas e sirva ainda quente.',
    ],

    dicas: [
      'Não coloque o frango na frigideira antes que ela esteja bem aquecida.',
      'Evite cozinhar o frango em fogo muito alto para não ressecar.',
      'O molho pode ser ajustado com um pouco de leite caso fique muito espesso.',
      'Ervas frescas podem ser adicionadas no final para intensificar o aroma.',
    ],

    historia:
      'Preparações com frango e ervas fazem parte de diversas tradições culinárias europeias, com variações de ingredientes e temperos conforme a região. A combinação também se tornou bastante popular na cozinha contemporânea.',

    chef: 'Chef Jacquin',
    tipoPrato: 'Carne',
    culinaria: 'Francesa',

    temas: ['conforto', 'cremoso'],
    estacoes: ['outono', 'inverno'],
    epocas: [],
  },

  {
    id: '3',
    titulo: 'Bowl de salada',
    tempo: '15 min',
    categoriaId: '3',
    isSaudavel: true,
    dataAdicao: '2026-09-10',

    imagem:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=780&h=560&fit=crop&auto=format',

    imagens: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=780&h=560&fit=crop&auto=format',
    ],

    avaliacao: 4.5,
    avaliacoesCount: 82,
    dificuldade: 'Fácil',
    porcoes: 1,

    descricao:
      'Combinação nutritiva de folhas frescas, abacate e grão-de-bico.',

    ingredientes: [
      {
        qtd: 2,
        unidade: 'xícaras',
        nome: 'Mix de folhas verdes',
      },
      {
        qtd: '1/2',
        unidade: 'un.',
        nome: 'Abacate',
      },
      {
        qtd: 1,
        unidade: 'xícara',
        nome: 'Grão-de-bico cozido',
      },
      {
        qtd: 1,
        unidade: 'un.',
        nome: 'Tomate',
      },
      {
        qtd: 1,
        unidade: 'colher de sopa',
        nome: 'Azeite de oliva',
      },
      {
        qtd: 1,
        unidade: 'colher de sopa',
        nome: 'Suco de limão',
      },
      {
        qtd: 1,
        unidade: 'pitada',
        nome: 'Sal',
      },
    ],

    passos: [
      'Lave e seque bem as folhas.',
      'Corte o tomate e o abacate em pedaços.',
      'Coloque as folhas em uma tigela.',
      'Adicione o grão-de-bico, o tomate e o abacate.',
      'Misture o azeite com o suco de limão.',
      'Tempere a salada com o molho.',
      'Finalize com sal e sirva.',
    ],

    dicas: [
      'Seque bem as folhas para evitar que o molho fique aguado.',
      'Adicione o abacate próximo ao momento de servir.',
      'Você pode substituir o grão-de-bico por lentilhas ou outros grãos.',
      'Prepare o molho separadamente para controlar melhor a quantidade utilizada.',
    ],

    historia:
      'Bowls de salada ganharam diferentes versões na culinária contemporânea, combinando vegetais frescos, grãos e outros ingredientes nutritivos. O formato permite variar os ingredientes de acordo com a estação e a preferência de cada pessoa.',

    chef: 'Chef Paola',
    tipoPrato: 'Salada',
    culinaria: 'Contemporânea',

    temas: ['leve', 'saudavel'],
    estacoes: ['primavera', 'verao'],
    epocas: [],
  },

  {
    id: '4',
    titulo: 'Rabanada de Natal',
    tempo: '30 min',
    categoriaId: '4',
    isSaudavel: false,
    dataAdicao: '2026-09-15',

    imagem:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=780&h=560&fit=crop&auto=format',

    imagens: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=780&h=560&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=780&h=560&fit=crop&auto=format',
    ],

    avaliacao: 4.9,
    avaliacoesCount: 250,
    dificuldade: 'Fácil',
    porcoes: 6,

    descricao:
      'Rabanada tradicional para deixar as celebrações de Natal ainda mais especiais.',

    ingredientes: [
      {
        qtd: 6,
        unidade: 'fatias',
        nome: 'Pão amanhecido',
      },
      {
        qtd: 2,
        unidade: 'un.',
        nome: 'Ovos',
      },
      {
        qtd: 250,
        unidade: 'ml',
        nome: 'Leite',
      },
      {
        qtd: 4,
        unidade: 'colheres de sopa',
        nome: 'Açúcar',
      },
      {
        qtd: 1,
        unidade: 'colher de chá',
        nome: 'Canela em pó',
      },
      {
        qtd: 1,
        unidade: 'colher de chá',
        nome: 'Essência de baunilha',
      },
      {
        qtd: 300,
        unidade: 'ml',
        nome: 'Óleo para fritar',
      },
    ],

    passos: [
      'Corte o pão em fatias médias.',
      'Misture o leite com a baunilha.',
      'Passe as fatias de pão rapidamente no leite.',
      'Em seguida, passe as fatias nos ovos batidos.',
      'Aqueça o óleo em fogo médio.',
      'Frite as fatias até dourarem dos dois lados.',
      'Escorra o excesso de óleo em papel absorvente.',
      'Misture o açúcar com a canela e passe nas rabanadas.',
      'Sirva ainda mornas ou em temperatura ambiente.',
    ],

    dicas: [
      'Prefira pão amanhecido, pois ele absorve melhor a mistura sem desmanchar.',
      'Não deixe o pão mergulhado no leite por muito tempo.',
      'Mantenha o óleo em temperatura média para evitar que a rabanada queime por fora.',
      'Você pode finalizar com açúcar e canela somente no momento de servir.',
    ],

    historia:
      'A rabanada é uma preparação tradicional associada às celebrações de Natal em diversos países. No Brasil, tornou-se um doce bastante comum nas festas de fim de ano e ganhou diferentes versões familiares.',

    chef: 'Chef Paola',
    tipoPrato: 'Sobremesa',
    culinaria: 'Brasileira',

    temas: ['natal', 'festas', 'sobremesa'],
    estacoes: ['verao'],
    epocas: ['natal'],
  },
];