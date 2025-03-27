import express from 'express';
import {
  bookAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
  myAppointments,
} from '../controllers/appointment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const appointmentsRouter = express.Router();

appointmentsRouter.post('/book', authenticateToken, bookAppointment);
appointmentsRouter.get('/slots', authenticateToken, getAvailableSlots);

appointmentsRouter.put('/:id', authenticateToken, updateAppointment);

appointmentsRouter.delete('/:id', authenticateToken, deleteAppointment);

appointmentsRouter.get(
  '/my-appointments/:userId',
  authenticateToken,
  myAppointments
);

export default appointmentsRouter;
