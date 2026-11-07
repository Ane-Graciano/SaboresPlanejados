"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarReceitaPorId = exports.buscarReceitas = exports.buscarReceitasPorTema = exports.buscarReceitasSazonais = exports.buscarReceitasEmDestaque = exports.buscarTodasReceitas = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Relacionamentos necessários para montar o objeto esperado pelo aplicativo.
const incluirRelacoes = {
    imagens: {
        orderBy: { ordem: 'asc' },
    },
    ingredientes: {
        orderBy: { ordem: 'asc' },
        include: {
            ingrediente: true,
        },
    },
    passos: {
        orderBy: { ordem: 'asc' },
    },
    dicas: {
        orderBy: { ordem: 'asc' },
    },
    temas: {
        include: {
            tema: true,
        },
    },
    estacoes: true,
    epocas: true,
};
// Consulta centralizada para reutilizar a estrutura dos relacionamentos.
const consultarReceitas = () => {
    return prisma_1.default.receita.findMany({
        include: incluirRelacoes,
    });
};
// Converte o formato retornado pelo Prisma para o formato do aplicativo.
const converterReceita = (receita) => {
    return {
        id: receita.id,
        titulo: receita.titulo,
        tempo: receita.tempo,
        dataAdicao: receita.dataAdicao.toISOString().slice(0, 10),
        categoriaId: receita.categoriaId,
        isSaudavel: receita.isSaudavel,
        imagem: receita.imagem,
        imagens: [
            receita.imagem,
            ...receita.imagens.map((imagem) => imagem.url),
        ],
        avaliacao: receita.avaliacao ?? undefined,
        avaliacoesCount: receita.avaliacoesCount ?? undefined,
        dificuldade: receita.dificuldade ?? undefined,
        porcoes: receita.porcoes ?? undefined,
        descricao: receita.descricao,
        historia: receita.historia ?? undefined,
        ingredientes: receita.ingredientes.map((item) => ({
            nome: item.ingrediente.nome,
            qtd: item.qtd ?? undefined,
            unidade: item.unidade ?? undefined,
        })),
        passos: receita.passos.map((passo) => passo.texto),
        dicas: receita.dicas.map((dica) => dica.texto),
        chef: receita.chef,
        tipoPrato: receita.tipoPrato,
        culinaria: receita.culinaria,
        temas: receita.temas.map((item) => item.tema.nome),
        estacoes: receita.estacoes.map((item) => item.estacao),
        epocas: receita.epocas.map((item) => item.epoca),
    };
};
// Buscar todas as receitas.
const buscarTodasReceitas = async () => {
    const registros = await consultarReceitas();
    return registros.map(converterReceita);
};
exports.buscarTodasReceitas = buscarTodasReceitas;
// Buscar três receitas em destaque.
const buscarReceitasEmDestaque = async () => {
    const registros = await consultarReceitas();
    const receitasConvertidas = registros.map(converterReceita);
    const receitasEmbaralhadas = [...receitasConvertidas].sort(() => Math.random() - 0.5);
    return receitasEmbaralhadas.slice(0, 3);
};
exports.buscarReceitasEmDestaque = buscarReceitasEmDestaque;
// Identificar a estação atual.
const identificarEstacaoAtual = () => {
    const mes = new Date().getMonth() + 1;
    if (mes >= 3 && mes < 6) {
        return 'outono';
    }
    if (mes >= 6 && mes < 9) {
        return 'inverno';
    }
    if (mes >= 9 && mes < 12) {
        return 'primavera';
    }
    return 'verao';
};
// Buscar receitas da estação atual.
const buscarReceitasSazonais = async () => {
    const estacaoAtual = identificarEstacaoAtual();
    const registros = await prisma_1.default.receita.findMany({
        where: {
            estacoes: {
                some: {
                    estacao: estacaoAtual,
                },
            },
        },
        include: incluirRelacoes,
    });
    return {
        estacao: estacaoAtual,
        receitas: registros.map(converterReceita),
    };
};
exports.buscarReceitasSazonais = buscarReceitasSazonais;
// Identificar tema comemorativo atual.
const identificarTemaAtual = () => {
    const mes = new Date().getMonth() + 1;
    if (mes === 12) {
        return 'natal';
    }
    if (mes === 6) {
        return 'festa-junina';
    }
    return null;
};
// Buscar receitas relacionadas ao tema atual.
const buscarReceitasPorTema = async () => {
    const temaAtual = identificarTemaAtual();
    if (!temaAtual) {
        return {
            tema: null,
            receitas: [],
        };
    }
    const registros = await prisma_1.default.receita.findMany({
        where: temaAtual === 'festa-junina'
            ? {
                epocas: {
                    some: {
                        epoca: 'festa_junina',
                    },
                },
            }
            : {
                temas: {
                    some: {
                        tema: {
                            nome: temaAtual,
                        },
                    },
                },
            },
        include: incluirRelacoes,
    });
    return {
        tema: temaAtual,
        receitas: registros.map(converterReceita),
    };
};
exports.buscarReceitasPorTema = buscarReceitasPorTema;
// Ordenar receitas.
const ordenarReceitas = (receitasFiltradas, ordenacao) => {
    const resultado = [...receitasFiltradas];
    if (!ordenacao.ordenarPor) {
        return resultado;
    }
    const ordem = ordenacao.ordem ?? 'asc';
    resultado.sort((a, b) => {
        let comparacao = 0;
        if (ordenacao.ordenarPor === 'tempo') {
            comparacao =
                parseInt(a.tempo, 10) - parseInt(b.tempo, 10);
        }
        if (ordenacao.ordenarPor === 'popularidade') {
            comparacao =
                (a.avaliacoesCount ?? 0) -
                    (b.avaliacoesCount ?? 0);
        }
        if (ordenacao.ordenarPor === 'data') {
            comparacao =
                new Date(a.dataAdicao).getTime() -
                    new Date(b.dataAdicao).getTime();
        }
        return ordem === 'desc' ? -comparacao : comparacao;
    });
    return resultado;
};
// Buscar receitas com filtros e ordenação.
const buscarReceitas = async (filtros, ordenacao = {}) => {
    const where = {};
    if (filtros.busca) {
        const busca = filtros.busca.trim();
        where.OR = [
            { titulo: { contains: busca } },
            { descricao: { contains: busca } },
            { chef: { contains: busca } },
            { tipoPrato: { contains: busca } },
            { culinaria: { contains: busca } },
            {
                ingredientes: {
                    some: {
                        ingrediente: {
                            nome: { contains: busca },
                        },
                    },
                },
            },
        ];
    }
    if (filtros.ingrediente) {
        where.ingredientes = {
            some: {
                ingrediente: {
                    nome: {
                        contains: filtros.ingrediente.trim(),
                    },
                },
            },
        };
    }
    if (filtros.chef) {
        where.chef = {
            contains: filtros.chef.trim(),
        };
    }
    if (filtros.tipoPrato) {
        where.tipoPrato = {
            contains: filtros.tipoPrato.trim(),
        };
    }
    if (filtros.culinaria) {
        where.culinaria = {
            contains: filtros.culinaria.trim(),
        };
    }
    const registros = await prisma_1.default.receita.findMany({
        where,
        include: incluirRelacoes,
    });
    let resultado = registros.map(converterReceita);
    // O tempo está armazenado como texto (ex.: "35 min").
    // Por isso, o limite é aplicado após converter os registros.
    if (filtros.tempoMax !== undefined) {
        resultado = resultado.filter((receita) => parseInt(receita.tempo, 10) <= filtros.tempoMax);
    }
    return ordenarReceitas(resultado, ordenacao);
};
exports.buscarReceitas = buscarReceitas;
// Buscar uma receita pelo ID.
const buscarReceitaPorId = async (id) => {
    const registro = await prisma_1.default.receita.findUnique({
        where: { id },
        include: incluirRelacoes,
    });
    if (!registro) {
        return undefined;
    }
    return converterReceita(registro);
};
exports.buscarReceitaPorId = buscarReceitaPorId;
