"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const patient_controller_1 = require("../controllers/patient.controller");
authRouter.post('/login', patient_controller_1.loginUser);
exports.default = authRouter;
