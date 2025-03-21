import prisma from '../lib/prisma';
import { RequestHandler } from 'express';
import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwtTokenGeneration';
import { verifyRefreshToken } from '../utils/jwtTokenGeneration';
import { JwtPayload } from 'jsonwebtoken';
import { doctorRegistrationValidation } from '../utils/validations/validation';

export const createDoctor: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = doctorRegistrationValidation.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.flatten(),
    });
    return;
  }
  const adminId = (req.user as JwtPayload)?.id || '';
  if (!adminId) {
    res.status(403).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const admin = await prisma.hospitalAdmin.findFirst({
    where: { userId: adminId },
    select: {
      hospitalId: true,
    },
  });

  if (!admin?.hospitalId) {
    res.status(403).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const {
    email,
    password,
    firstName,
    lastName,
    role,
    gender,
    phoneNumber,
    speciality,
    licenseNumber,
    address,
    availableFrom,
    availableTo,
  } = result.data;

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    res.status(400).json({ errors: [{ message: 'Email already exists' }] });
    return;
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePicture: req.file ? req.file.path : '',
      gender,
      role,
      phoneNumber,
      doctor: {
        create: {
          speciality,
          hospitalId: admin.hospitalId,
          licenseNumber,
          phoneNumber,
          availableFrom,
          availableTo,
          address: address ? { create: address } : undefined,
        },
      },
      address: address ? { create: address } : undefined,
    },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      gender: true,
      doctor: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  //
  res.status(201).json({
    message: 'User created successfully',
    newUser,
  });
};

// login with email and password

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Missing email or password' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
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
  res.json({
    message: 'Login successful',
    accessToken,
    refreshToken,
  });
};

// update doctor

export const updateDoctor: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log(id);

  const { email, firstName, lastName, phoneNumber } = req.body;
  const doctor = await prisma.doctor.update({
    where: { id: parseInt(id) },

    data: {
      phoneNumber,
      user: {
        update: { firstName, lastName, email },
      },
    },
    select: {
      id: true,
      userId: true,
      speciality: true,
      hospitalId: true,
      licenseNumber: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!doctor) {
    res.status(404).json({ message: 'Doctor not found' });
    return;
  }
  res.json({ message: 'Doctor updated successfully', doctor });
};

// delete doctor

export const deleteDoctor: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const doctor = await prisma.doctor.delete({
    where: { id: parseInt(id) },
  });
  if (!doctor) {
    res.status(404).json({ message: 'Doctor not found' });
    return;
  }
  res.json({ message: 'Doctor deleted successfully' });
};

// get doctor by id

export const getDoctorById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          profilePicture: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
      },
      speciality: true,
      hospital: {
        select: {
          name: true,
        },
      },
      licenseNumber: true,
      phoneNumber: true,
    },
  });
  if (!doctor) {
    res.status(404).json({ message: 'Doctor not found' });
    return;
  }
  res.json(doctor);
};

// get all doctors
export const getAllDoctors: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          phoneNumber: true,
        },
      },
      hospital: {
        select: {
          name: true,
        },
      },
      speciality: true,
      hospitalId: true,
      licenseNumber: true,
      phoneNumber: true,
      available: true,
    },
  });
  res.json({ doctors });
};

// get doctors by hospital

export const getDoctorsByHospital: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const adminId = (req.user as JwtPayload)?.id || '';
  if (!adminId) {
    res.status(403).json({ message: 'Unauthorized access' });
    return;
  }
  const hospital = await prisma.hospitalAdmin.findFirst({
    where: { userId: adminId },
    select: { hospitalId: true },
  });
  if (!hospital) {
    res.status(404).json({ message: 'Hospital not found' });
    return;
  }

  const doctors = await prisma.doctor.findMany({
    where: { hospitalId: hospital.hospitalId },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          phoneNumber: true,
        },
      },
      speciality: true,
      licenseNumber: true,
      phoneNumber: true,
    },
  });
  res.json({ message: 'Doctors found successfully', doctors });
};

// get doctors by specialty
export const getDoctorsBySpecialty: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { speciality } = req.params;

  const doctors = await prisma.doctor.findMany({
    where: { speciality },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          phoneNumber: true,
        },
      },
      speciality: true,
      hospitalId: true,
      licenseNumber: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json({ message: 'Doctors found successfully', doctors });
};

// get doctors by city

export const getDoctorsByCity: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { city } = req.params;
  const cityAddress = await prisma.address.findFirst({
    where: { city },
    select: { id: true },
  });
  const doctors = await prisma.doctor.findMany({
    where: {
      address: cityAddress,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          phoneNumber: true,
        },
      },
      speciality: true,
      hospital: true,
      licenseNumber: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json({ message: 'Doctors found successfully', doctors });
};

// get doctors appintments

export const getDoctorsAppointments: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const doctorId = await prisma.doctor.findFirst({
    where: { userId: parseInt(id) },
    select: { id: true },
  });
  if (!doctorId) {
    res.status(404).json({ message: 'Doctor not found' });
    return;
  }
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctorId.id },
    select: {
      id: true,
      patient: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePicture: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      doctorId: true,
      startTime: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });
  res.json(appointments);
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }
  const payload = verifyRefreshToken(refreshToken) as JwtPayload;
  if (!payload) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }
  // Generate new access token
  const accessToken = generateAccessToken({
    id: (payload as JwtPayload).id,
    email: (payload as JwtPayload).email,
    role: (payload as JwtPayload).role,
  });
  res.json({ accessToken });
};
