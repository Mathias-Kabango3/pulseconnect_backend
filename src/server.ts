import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import 'express-async-errors';
import cors from 'cors';
import prisma from '../src/lib/prisma';
import logger from './lib/logger';
dotenv.config();

import patient from './routes/patient.routes';
import doctorRouter from './routes/doctor.routes';
import hospitalRouter from './routes/hospital.routes';
import authRouter from './routes/auth.routes';
import adminRouter from './routes/admin.routes';
import appointmentsRouter from './routes/appointment.routes';
import errorHandler from './middleware/errors';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'https://pulseconnect-seven.vercel.app/',
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/api/v1/patient', patient);
app.use('/api/v1/hospital', hospitalRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/appointment', appointmentsRouter);
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});
app.use(errorHandler);
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Server started successfully');
    app.listen(PORT, () => {
      console.log(`Serving on port ${PORT}`);
    });
  } catch {
    console.error('Failed to start server');
    process.exit(1);
  }
};

startServer();
