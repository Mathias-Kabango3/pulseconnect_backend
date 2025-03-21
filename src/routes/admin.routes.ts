import express from 'express';
const adminRouter = express.Router();
import { createAdmin, allAppointments } from '../controllers/admin.controller';
import { loginUser } from '../controllers/patient.controller';
import adminMiddleware from '../middleware/admin.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../lib/multerConfig';

adminRouter.post('/register', upload.single('image'), createAdmin);
adminRouter.post('/login', loginUser);
adminRouter.get('/', authenticateToken, adminMiddleware, allAppointments);

export default adminRouter;
