"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarPreferencias = exports.buscarPreferencias = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const buscarPreferencias = async (firebaseUid) => {
    return prisma_1.default.preferenciasAlimentares.findUnique({
        where: { firebaseUid },
    });
};
exports.buscarPreferencias = buscarPreferencias;
const salvarPreferencias = async (firebaseUid, restricoes) => {
    return prisma_1.default.preferenciasAlimentares.upsert({
        where: { firebaseUid },
        update: { restricoes },
        create: {
            firebaseUid,
            restricoes,
        },
    });
};
exports.salvarPreferencias = salvarPreferencias;
