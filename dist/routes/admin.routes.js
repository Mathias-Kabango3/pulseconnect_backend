"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
const admin_controller_1 = require("../controllers/admin.controller");
const patient_controller_1 = require("../controllers/patient.controller");
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multerConfig_1 = __importDefault(require("../lib/multerConfig"));
adminRouter.post('/register', multerConfig_1.default.single('image'), admin_controller_1.createAdmin);
adminRouter.post('/login', patient_controller_1.loginUser);
adminRouter.get('/', auth_middleware_1.authenticateToken, admin_middleware_1.default, admin_controller_1.allAppointments);
exports.default = adminRouter;
