import express from 'express';

import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctorsByCity,
  getDoctorsAppointments,
  getDoctorsBySpecialty,
  getDoctorsByHospital,
  getAllDoctors,
} from '../controllers/doctor.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';
import upload from '../lib/multerConfig';

const doctorRouter = express.Router();

doctorRouter.post(
  '/register',
  upload.single('image'),
  authenticateToken,
  createDoctor
);
doctorRouter.get('/hospital', authenticateToken, getDoctorsByHospital);
doctorRouter.put('/:id', authenticateToken, adminMiddleware, updateDoctor);

doctorRouter.delete(
  '/:id',
  authenticateToken,
  adminMiddleware,
  deleteDoctor
);

doctorRouter.get('/:id', authenticateToken, getDoctorById);

doctorRouter.get('/city/:city', authenticateToken, getDoctorsByCity);

doctorRouter.get(
  '/appointments/:id',
  authenticateToken,
  getDoctorsAppointments
);

doctorRouter.get(
  '/specialty/:specialty',
  authenticateToken,
  getDoctorsBySpecialty
);

doctorRouter.get('/', authenticateToken, getAllDoctors);

export default doctorRouter;
