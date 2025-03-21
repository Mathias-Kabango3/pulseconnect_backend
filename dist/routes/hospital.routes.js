"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hospitalRouter = express_1.default.Router();
const hospital_controller_1 = require("../controllers/hospital.controller");
const multerConfig_1 = __importDefault(require("../lib/multerConfig"));
// Defining routes
hospitalRouter.post('/register', multerConfig_1.default.single('image'), hospital_controller_1.hospitalRegistration);
hospitalRouter.put('/:id', hospital_controller_1.hospitalUpdate);
hospitalRouter.delete('/:id', hospital_controller_1.hospitalDelete);
exports.default = hospitalRouter;
