"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarAutenticacao = void 0;
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
const verificarAutenticacao = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Token de autenticação não informado.',
            });
        }
        const token = authorization.split(' ')[1];
        const decodedToken = await firebaseAdmin_1.adminAuth.verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Token inválido ou expirado.',
        });
    }
};
exports.verificarAutenticacao = verificarAutenticacao;
