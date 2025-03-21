import express from 'express';
const hospitalRouter = express.Router();
import {
  hospitalDelete,
  hospitalRegistration,
  hospitalUpdate,
} from '../controllers/hospital.controller';
import upload from '../lib/multerConfig';

// Defining routes

hospitalRouter.post('/register',upload.single('image'),hospitalRegistration);
hospitalRouter.put('/:id', hospitalUpdate);
hospitalRouter.delete('/:id', hospitalDelete);

export default hospitalRouter;