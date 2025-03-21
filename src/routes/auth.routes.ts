import express from 'express';
const authRouter = express.Router();
import { loginUser } from '../controllers/patient.controller';

authRouter.post('/login', loginUser);
export default authRouter;
