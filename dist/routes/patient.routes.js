"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multerConfig_1 = __importDefault(require("../lib/multerConfig"));
const patient = (0, express_1.Router)();
patient.post('/register', multerConfig_1.default.single('image'), patient_controller_1.createUser);
patient.post('/login', patient_controller_1.loginUser);
patient.post('/refresh-token', patient_controller_1.refreshToken);
patient.put('/:id', auth_middleware_1.authenticateToken, patient_controller_1.updatePatient);
patient.get('/:id', auth_middleware_1.authenticateToken, admin_middleware_1.default, patient_controller_1.singlePatient);
patient.delete('/:id', auth_middleware_1.authenticateToken, admin_middleware_1.default, patient_controller_1.deletePatient);
exports.default = patient;
