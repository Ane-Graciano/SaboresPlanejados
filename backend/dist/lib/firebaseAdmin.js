"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firebaseApp = (0, app_1.getApps)().length > 0
    ? (0, app_1.getApps)()[0]
    : (0, app_1.initializeApp)();
exports.adminAuth = (0, auth_1.getAuth)(firebaseApp);
