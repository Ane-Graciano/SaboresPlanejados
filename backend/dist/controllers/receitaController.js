"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceitaPorId = exports.getReceitasPorTema = exports.getReceitasSazonais = exports.getReceitasEmDestaque = exports.getTodasReceitas = void 0;
const receitaService_1 = require("../services/receitaService");
// Listar e filtrar receitas
const getTodasReceitas = async (req, res) => {
    try {
        const { busca, ingrediente, chef, tipoPrato, culinaria, tempoMax, ordenarPor, ordem, } = req.query;
        const opcoesOrdenacaoValidas = [
            'tempo',
            'popularidade',
            'data',
        ];
        const ordensValidas = ['asc', 'desc'];
        if (ordenarPor !== undefined &&
            (typeof ordenarPor !== 'string' ||
                !opcoesOrdenacaoValidas.includes(ordenarPor))) {
            return res.status(400).json({
                mensagem: 'O critério de ordenação informado é inválido.',
            });
        }
        if (ordem !== undefined &&
            (typeof ordem !== 'string' ||
                !ordensValidas.includes(ordem))) {
            return res.status(400).json({
                mensagem: 'A ordem de classificação informada é inválida.',
            });
        }
        const ordenarPorValido = typeof ordenarPor === 'string' &&
            opcoesOrdenacaoValidas.includes(ordenarPor)
            ? ordenarPor
            : undefined;
        const ordemValida = typeof ordem === 'string' &&
            ordensValidas.includes(ordem)
            ? ordem
            : undefined;
        const tempoMaximo = typeof tempoMax === 'string' && tempoMax.trim() !== ''
            ? Number(tempoMax)
            : undefined;
        if (tempoMaximo !== undefined &&
            (!Number.isFinite(tempoMaximo) || tempoMaximo < 0)) {
            return res.status(400).json({
                mensagem: 'O tempo máximo informado é inválido.',
            });
        }
        const receitas = await (0, receitaService_1.buscarReceitas)({
            busca: typeof busca === 'string' ? busca : undefined,
            ingrediente: typeof ingrediente === 'string' ? ingrediente : undefined,
            chef: typeof chef === 'string' ? chef : undefined,
            tipoPrato: typeof tipoPrato === 'string' ? tipoPrato : undefined,
            culinaria: typeof culinaria === 'string' ? culinaria : undefined,
            tempoMax: tempoMaximo,
        }, {
            ordenarPor: ordenarPorValido,
            ordem: ordemValida,
        });
        return res.json(receitas);
    }
    catch (erro) {
        console.error('Erro ao buscar receitas:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível buscar as receitas.',
        });
    }
};
exports.getTodasReceitas = getTodasReceitas;
// Buscar receitas em destaque
const getReceitasEmDestaque = async (req, res) => {
    try {
        const receitas = await (0, receitaService_1.buscarReceitasEmDestaque)();
        return res.json(receitas);
    }
    catch (erro) {
        console.error('Erro ao buscar receitas em destaque:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível buscar as receitas em destaque.',
        });
    }
};
exports.getReceitasEmDestaque = getReceitasEmDestaque;
// Buscar receitas sazonais
const getReceitasSazonais = async (req, res) => {
    try {
        const resultado = await (0, receitaService_1.buscarReceitasSazonais)();
        return res.json(resultado);
    }
    catch (erro) {
        console.error('Erro ao buscar receitas sazonais:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível buscar as receitas sazonais.',
        });
    }
};
exports.getReceitasSazonais = getReceitasSazonais;
// Buscar receitas por tema comemorativo
const getReceitasPorTema = async (req, res) => {
    try {
        const resultado = await (0, receitaService_1.buscarReceitasPorTema)();
        return res.json(resultado);
    }
    catch (erro) {
        console.error('Erro ao buscar receitas por tema:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível buscar receitas por tema.',
        });
    }
};
exports.getReceitasPorTema = getReceitasPorTema;
// Buscar uma receita pelo ID
const getReceitaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string' || !id.trim()) {
            return res.status(400).json({
                mensagem: 'ID da receita inválido.',
            });
        }
        const receita = await (0, receitaService_1.buscarReceitaPorId)(id);
        if (!receita) {
            return res.status(404).json({
                mensagem: 'Receita não encontrada.',
            });
        }
        return res.json(receita);
    }
    catch (erro) {
        console.error('Erro ao buscar receita:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível buscar a receita.',
        });
    }
};
exports.getReceitaPorId = getReceitaPorId;
