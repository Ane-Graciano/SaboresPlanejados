"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarPreferencias = exports.obterPreferencias = void 0;
const preferenciasAlimentaresService_1 = require("../services/preferenciasAlimentaresService");
const obterPreferencias = async (req, res) => {
    try {
        const firebaseUid = req.uid;
        const preferencias = await (0, preferenciasAlimentaresService_1.buscarPreferencias)(firebaseUid);
        return res.json(preferencias || { restricoes: [] });
    }
    catch (error) {
        console.error('Erro ao buscar preferências:', error);
        return res.status(500).json({
            message: 'Erro ao buscar preferências alimentares.',
        });
    }
};
exports.obterPreferencias = obterPreferencias;
const atualizarPreferencias = async (req, res) => {
    try {
        const firebaseUid = req.uid;
        const { restricoes } = req.body;
        if (!Array.isArray(restricoes) ||
            !restricoes.every((item) => typeof item === 'string' && item.trim().length > 0)) {
            return res.status(400).json({
                message: 'Informe uma lista válida de restrições.',
            });
        }
        const preferencias = await (0, preferenciasAlimentaresService_1.salvarPreferencias)(firebaseUid, [...new Set(restricoes.map((item) => item.trim()))]);
        return res.json(preferencias);
    }
    catch (error) {
        console.error('Erro ao atualizar preferências:', error);
        return res.status(500).json({
            message: 'Erro ao atualizar preferências alimentares.',
        });
    }
};
exports.atualizarPreferencias = atualizarPreferencias;
