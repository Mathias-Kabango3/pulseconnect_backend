import { Router } from 'express';
import {
  createUser,
  loginUser,
  updatePatient,
  deletePatient,
  singlePatient,
  refreshToken,
} from '../controllers/patient.controller';
import adminMiddleware from '../middleware/admin.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../lib/multerConfig';

const patient = Router();
patient.post('/register', upload.single('image'), createUser);
patient.post('/login', loginUser);
patient.post('/refresh-token', refreshToken);
patient.put('/:id', authenticateToken, updatePatient);
patient.get('/:id', authenticateToken, adminMiddleware, singlePatient);
patient.delete('/:id', authenticateToken, adminMiddleware, deletePatient);

export default patient;
