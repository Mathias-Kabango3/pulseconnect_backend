"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const appointmentsRouter = express_1.default.Router();
appointmentsRouter.post('/book', auth_middleware_1.authenticateToken, appointment_controller_1.bookAppointment);
appointmentsRouter.get('/slots', auth_middleware_1.authenticateToken, appointment_controller_1.getAvailableSlots);
appointmentsRouter.put('/:id', auth_middleware_1.authenticateToken, appointment_controller_1.updateAppointment);
appointmentsRouter.delete('/:id', auth_middleware_1.authenticateToken, appointment_controller_1.deleteAppointment);
appointmentsRouter.get('/my-appointments/:userId', auth_middleware_1.authenticateToken, appointment_controller_1.myAppointments);
exports.default = appointmentsRouter;
