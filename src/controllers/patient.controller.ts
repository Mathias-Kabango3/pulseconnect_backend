import prisma from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtTokenGeneration';
import { comparePassword, hashPassword } from '../utils/hash';
import { Response, Request } from 'express';
import {
  patientValidationSchema,
  patientUpdateValidation,
} from '../utils/validations/validation';
import { JwtPayload } from 'jsonwebtoken';

// Create a user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = patientValidationSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: JSON.parse(result.error.message),
    });
    return;
  }

  // check if the user is already in  database

  const userExists = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
  });
  if (userExists) {
    res.status(400).json({
      success: false,
      message: 'User already exists',
    });
    return;
  }
  // hash the password
  const hashedPassword = await hashPassword(result.data.password);
  // create user in database
  const { email, firstName, lastName, dob, gender, address } = result.data;
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePicture: req.file ? req.file.path : '',
      dob,
      gender,
      patient: {
        create: {},
      },
      address: address ? { create: address } : undefined,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      gender: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: newUser,
  });
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  // check for email and password
  if (!email || !password) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
    return;
  }
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
    return;
  }

  // Compare hashed password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
    return;
  }

  // Generate access and refresh tokens
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      gender: user.gender,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};

// update patient

export const updatePatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const results = patientUpdateValidation.safeParse(req.body);
  if (!results.success) {
    res.status(400).json({
      message: JSON.parse(results.error.message),
    });
    return;
  }
  const updatedPatient = await prisma.user.update({
    where: { id },
    data: {
      firstName: results.data.firstName,
      lastName: results.data.lastName,
      middleName: results.data.middleName,
      dob: results.data.dob,
      gender: results.data.gender,
      email: results.data.email,
      phoneNumber: results.data.phoneNumber,
    },
  });
  res.status(200).json({
    message: 'Patient updated successfully',
    patient: updatedPatient,
  });
};

export const deletePatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  await prisma.patient.delete({ where: { id } });
  res
    .status(200)
    .json({ success: true, message: 'Patient deleted successfully' });
};

export const singlePatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id) as number;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          profilePicture: true,
        },
      },
      appointments: true,
    },
  });
  if (!patient) {
    res.status(404).json({ success: false, message: 'Patient not found' });
    return;
  }
  res.status(200).json({ success: true, patient });
};

// Refresh token

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res
      .status(401)
      .json({ success: false, message: 'No refresh token provided' });
    return;
  }
  const payload = verifyRefreshToken(refreshToken) as JwtPayload;
  if (!payload) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
    return;
  }
  // Generate new access token
  const accessToken = generateAccessToken({
    id: (payload as JwtPayload).id,
    email: (payload as JwtPayload).email,
    role: (payload as JwtPayload).role,
  });
  res.json({ success: true, accessToken });
};
