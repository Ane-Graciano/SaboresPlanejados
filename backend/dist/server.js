"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receitaRoutes_1 = __importDefault(require("./routes/receitaRoutes"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const preferenciasAlimentaresRoutes_1 = __importDefault(require("./routes/preferenciasAlimentaresRoutes"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sabores Planejados funcionando!',
    });
});
app.use('/receitas', receitaRoutes_1.default);
app.use('/preferencias-alimentares', preferenciasAlimentaresRoutes_1.default);
const iniciarServidor = async () => {
    try {
        await prisma_1.default.$connect();
        console.log('Conexão com MySQL estabelecida!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    }
    catch (erro) {
        console.error('Erro ao conectar com o MySQL:', erro);
        await prisma_1.default.$disconnect();
        process.exit(1);
    }
};
iniciarServidor();
