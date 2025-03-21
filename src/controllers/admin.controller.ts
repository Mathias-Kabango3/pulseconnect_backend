import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createAdminSchema } from '../utils/validations/validation';
import bcrypt from 'bcrypt';

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Validate input data
  const validatedData = createAdminSchema.safeParse(req.body);
  if (!validatedData.success) {
    res.status(400).json({ errors: validatedData.error });
    return;
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.data.email },
  });

  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' });
    return;
  }

  // Check if the hospital exists
  const hospital = await prisma.hospital.findUnique({
    where: { id: validatedData.data.hospitalId },
  });

  if (!hospital) {
    res.status(404).json({ message: 'Hospital not found' });
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

  // Create the admin user
  const newAdmin = await prisma.user.create({
    data: {
      firstName: validatedData.data.firstName,
      lastName: validatedData.data.lastName,
      profilePicture: req.file ? req.file.path : '',
      email: validatedData.data.email,
      password: hashedPassword,
      phoneNumber: validatedData.data.phoneNumber,
      hospitalId: validatedData.data.hospitalId,
      role: validatedData.data.role,
      gender: validatedData.data.gender,
      isApproved: true,
      address: validatedData.data.address
        ? { create: validatedData.data.address }
        : undefined,
    },
  });

  // Add the admin to the hospital's list of admins
  await prisma.hospitalAdmin.create({
    data: {
      userId: newAdmin.id,
      hospitalId: validatedData.data.hospitalId,
    },
  });

  res.status(201).json({
    message: 'Admin created and added to hospital successfully',
    admin: newAdmin,
  });
};
// Get all the appointments for the hospital

export const allAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user as { id: string };

  // Get hospital ID from hospitalAdmin table
  const hospitalAdmin = await prisma.hospitalAdmin.findFirst({
    where: { userId: parseInt(id) },
    select: { hospitalId: true },
  });

  if (!hospitalAdmin) {
    res.status(404).json({ error: 'Hospital not found for this admin' });
    return;
  }

  // Fetch appointments along with relevant details
  const appointments = await prisma.appointment.findMany({
    where: { hospitalId: hospitalAdmin.hospitalId },
    select: {
      id: true,
      startTime: true,
      status: true,
      patient: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              gender: true,
              isActive: true,
            },
          },
        },
      },
      hospital: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
      doctor: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              gender: true,
              isActive: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json(appointments);
};
