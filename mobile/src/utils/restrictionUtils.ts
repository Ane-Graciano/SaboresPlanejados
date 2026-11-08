
import { Ingrediente } from '../model/receita';

export interface IngredienteIncompativel {
  ingrediente: Ingrediente;
  restricoes: string[];
  substitutos: string[];
}

const normalizar = (texto: string): string => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

// Verifica expressões completas, evitando correspondências
// acidentais dentro de outras palavras.
const contemTermo = (
  nomeIngrediente: string,
  termos: string[],
): boolean => {
  return termos.some((termo) => {
    const termoNormalizado = normalizar(termo);
    const termoEscapado = termoNormalizado.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    const regex = new RegExp(
      `(^|\\s)${termoEscapado}(\\s|$)`,
    );

    return regex.test(nomeIngrediente);
  });
};

const TERMOS_RESTRICOES: Record<string, string[]> = {
  'Glúten': [
    'trigo',
    'farinha de trigo',
    'cevada',
    'centeio',
    'malte',
    'semola',
    'farinha de rosca',
    'gluten',
  ],

  'Lactose': [
    'leite',
    'leite de vaca',
    'leite integral',
    'leite desnatado',
    'leite em po',
    'queijo',
    'manteiga',
    'creme de leite',
    'leite condensado',
    'requeijao',
    'iogurte',
    'coalhada',
    'lactose',
  ],

  'Amendoim': [
    'amendoim',
    'pasta de amendoim',
  ],

  'Castanhas': [
    'castanha',
    'castanha de caju',
    'castanha do para',
    'amendoa',
    'nozes',
    'avela',
    'pistache',
    'macadamia',
  ],

  'Ovo': [
    'ovo',
    'ovos',
    'clara de ovo',
    'gema',
    'albumina',
    'maionese',
  ],

  'Peixes': [
    'peixe',
    'salmao',
    'atum',
    'sardinha',
    'bacalhau',
    'tilapia',
    'merluza',
    'truta',
  ],

  'Frutos do mar': [
    'camarao',
    'lula',
    'polvo',
    'caranguejo',
    'siri',
    'lagosta',
    'mexilhao',
    'ostra',
    'marisco',
  ],

  'Soja': [
    'soja',
    'tofu',
    'shoyu',
    'molho de soja',
    'proteina de soja',
    'leite de soja',
  ],
};

const EXCECOES: Record<string, string[]> = {
  'Glúten': [
    'sem gluten',
    'livre de gluten',
    'zero gluten',
  ],
  'Lactose': [
    'sem lactose',
    'zero lactose',
    'lactose zero',
    'leite vegetal',
    'leite de amendoas',
    'leite de coco',
    'leite de arroz',
    'leite de aveia',
    'leite de soja',
  ],
};

// Substituições específicas por ingrediente.
// As alternativas ainda serão filtradas pelas restrições do usuário.
const SUBSTITUICOES_INGREDIENTES: Record<string, string[]> = {
  'leite': [
    'Bebida de arroz',
    'Bebida de aveia certificada sem glúten',
    'Bebida de coco',
  ],
  'leite de vaca': [
    'Bebida de arroz',
    'Bebida de coco',
  ],
  'manteiga': [
    'Azeite de oliva',
    'Creme vegetal sem leite',
  ],
  'creme de leite': [
    'Creme de coco',
    'Creme de arroz',
  ],
  'iogurte': [
    'Iogurte de coco',
    'Iogurte de arroz',
  ],
  'farinha de trigo': [
    'Farinha de arroz',
    'Farinha de grão-de-bico',
  ],
  'trigo': [
    'Farinha de arroz',
    'Farinha de grão-de-bico',
  ],
  'farinha de rosca': [
    'Farinha de milho',
    'Farinha de arroz',
  ],
  'ovo': [
    'Linhaça hidratada',
    'Chia hidratada',
    'Purê de banana',
  ],
  'amendoim': [
    'Pasta de sementes de girassol',
    'Pasta de sementes de abóbora',
  ],
  'castanha': [
    'Sementes de girassol',
    'Sementes de abóbora',
  ],
  'amendoa': [
    'Sementes de girassol',
    'Sementes de abóbora',
  ],
  'nozes': [
    'Sementes de girassol',
    'Sementes de abóbora',
  ],
  'peixe': [
    'Cogumelos',
    'Grão-de-bico temperado',
  ],
  'camarao': [
    'Palmito',
    'Cogumelos',
  ],
  'tofu': [
    'Grão-de-bico',
    'Feijão branco',
    'Proteína de ervilha',
  ],
  'shoyu': [
    'Molho de coco sem soja',
  ],
};

const termosVegetarianos = [
  'carne bovina',
  'carne suina',
  'frango',
  'peru',
  'bacon',
  'presunto',
  'linguica',
  'salsicha',
  'peixe',
  'salmao',
  'atum',
  'sardinha',
  'bacalhau',
  'camarao',
  'lula',
  'polvo',
  'caranguejo',
  'lagosta',
];

const termosVeganos = [
  ...termosVegetarianos,
  'leite de vaca',
  'leite integral',
  'leite desnatado',
  'leite em po',
  'queijo',
  'manteiga',
  'iogurte',
  'creme de leite',
  'ovo',
  'mel',
  'gelatina',
  'maionese',
];

const possuiExcecao = (
  nomeIngrediente: string,
  restricao: string,
): boolean => {
  const excecoes = EXCECOES[restricao] || [];

  return contemTermo(nomeIngrediente, excecoes);
};

const identificarRestricoes = (
  nomeIngrediente: string,
  userRestrictions: string[],
): string[] => {
  const encontradas: string[] = [];

  Object.entries(TERMOS_RESTRICOES).forEach(
    ([restricao, termos]) => {
      const restricaoAtiva = userRestrictions.some(
        (item) => normalizar(item) === normalizar(restricao),
      );

      if (!restricaoAtiva) return;

      if (
        !possuiExcecao(nomeIngrediente, restricao) &&
        contemTermo(nomeIngrediente, termos)
      ) {
        encontradas.push(restricao);
      }
    },
  );

  const vegetarianoAtivo = userRestrictions.some(
    (item) => normalizar(item) === 'vegetariano',
  );

  const veganoAtivo = userRestrictions.some(
    (item) => normalizar(item) === 'vegano',
  );

  if (
    vegetarianoAtivo &&
    contemTermo(nomeIngrediente, termosVegetarianos)
  ) {
    encontradas.push('Vegetariano');
  }

  if (
    veganoAtivo &&
    contemTermo(nomeIngrediente, termosVeganos)
  ) {
    encontradas.push('Vegano');
  }

  return [...new Set(encontradas)];
};

const obterSubstitutosDoIngrediente = (
  nomeIngrediente: string,
): string[] => {
  const nomeNormalizado = normalizar(nomeIngrediente);

  const chave = Object.keys(SUBSTITUICOES_INGREDIENTES).find(
    (item) => {
      const chaveNormalizada = normalizar(item);

      return (
        nomeNormalizado === chaveNormalizada ||
        contemTermo(nomeNormalizado, [chaveNormalizada])
      );
    },
  );

  return chave
    ? [...SUBSTITUICOES_INGREDIENTES[chave]]
    : [];
};

// Verifica incompatibilidades e sugere alternativas.
export const checkRestrictions = (
  recipeIngredients: Ingrediente[],
  userRestrictions: string[],
): IngredienteIncompativel[] => {
  return recipeIngredients.flatMap((ingrediente) => {
    const nomeNormalizado = normalizar(ingrediente.nome || '');

    if (!nomeNormalizado) return [];

    const restricoes = identificarRestricoes(
      nomeNormalizado,
      userRestrictions,
    );

    if (restricoes.length === 0) return [];

    return [
      {
        ingrediente,
        restricoes,
        substitutos: obterSubstitutosDoIngrediente(
          nomeNormalizado,
        ),
      },
    ];
  });
};

// Mantida para compatibilidade com chamadas existentes.
export const obterSubstitutos = (
  restricao: string,
): string[] => {
  const chave = Object.keys(TERMOS_RESTRICOES).find(
    (item) => normalizar(item) === normalizar(restricao),
  );

  if (!chave) return [];

  const termos = TERMOS_RESTRICOES[chave];

  return [
    ...new Set(
      termos.flatMap((termo) =>
        SUBSTITUICOES_INGREDIENTES[normalizar(termo)] || [],
      ),
    ),
  ];
};
