"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAuth_1 = require("../middleware/firebaseAuth");
const preferenciasAlimentaresController_1 = require("../controllers/preferenciasAlimentaresController");
const router = (0, express_1.Router)();
router.get('/', firebaseAuth_1.verificarAutenticacao, preferenciasAlimentaresController_1.obterPreferencias);
router.put('/', firebaseAuth_1.verificarAutenticacao, preferenciasAlimentaresController_1.atualizarPreferencias);
exports.default = router;
