'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
const dotenv_1 = __importDefault(require('dotenv'));
require('express-async-errors');
const cors_1 = __importDefault(require('cors'));
const prisma_1 = __importDefault(require('./lib/prisma'));
const logger_1 = __importDefault(require('./lib/logger'));
dotenv_1.default.config();
const patient_routes_1 = __importDefault(require('./routes/patient.routes'));
const doctor_routes_1 = __importDefault(require('./routes/doctor.routes'));
const hospital_routes_1 = __importDefault(require('./routes/hospital.routes'));
const auth_routes_1 = __importDefault(require('./routes/auth.routes'));
const admin_routes_1 = __importDefault(require('./routes/admin.routes'));
const appointment_routes_1 = __importDefault(
  require('./routes/appointment.routes')
);
const errors_1 = __importDefault(require('./middleware/errors'));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(
  (0, cors_1.default)({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('tiny'));
app.use('/api/v1/patient', patient_routes_1.default);
app.use('/api/v1/hospital', hospital_routes_1.default);
app.use('/api/v1/doctor', doctor_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/appointment', appointment_routes_1.default);
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});
app.use(errors_1.default);
process.on('unhandledRejection', (reason, promise) => {
  logger_1.default.error(
    `Unhandled Rejection at: ${promise}, reason: ${reason}`
  );
});
process.on('uncaughtException', (error) => {
  logger_1.default.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});
const startServer = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield prisma_1.default.$connect();
      console.log('Server started successfully');
      app.listen(PORT, () => {
        console.log(`Serving on port ${PORT}`);
      });
    } catch (_a) {
      console.error('Failed to start server');
      process.exit(1);
    }
  });
startServer();
