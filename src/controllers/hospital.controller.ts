import { RequestHandler } from 'express';
import prisma from '../lib/prisma';
import {
  hospitalRegistrationValidation,
  hospitalUpdateSchema,
} from '../utils/validations/validation';

export const hospitalRegistration: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const results = hospitalRegistrationValidation.safeParse(req.body);
  if (!results.success) {
    res.status(400).json({ success: false, errors: results.error.format() });
    return;
  }

  const {
    name,
    email,
    address,
    phone,
    website,
    description,
    emergencyContact,
    registrationNumber,
    openingHours,
    services,
    departments,
    bedCapacity,
    availableBeds,
    acceptedInsuranceProviders,
    rating,
    totalReviews,
    operatingStatus,
    verifiedBy,
    facilities,
    queueSystem,
    telemedicine,
  } = results.data;

  const hospitalExists = await prisma.hospital.findUnique({
    where: { registrationNumber },
  });

  if (hospitalExists) {
    res
      .status(400)
      .json({ success: false, message: 'Hospital already registered' });
    return;
  }

  const hospital = await prisma.hospital.create({
    data: {
      name,
      email,
      phone,
      website,
      description,
      emergencyContact,
      registrationNumber,
      imageUrl: req.file ? req.file.path : "",
      openingHours,
      services,
      departments,
      bedCapacity,
      availableBeds,
      acceptedInsuranceProviders,
      rating,
      totalReviews,
      operatingStatus,
      verifiedBy,
      facilities,
      queueSystem,
      telemedicine,
      address: address
        ? {
            create: {
              street: address.street,
              city: address.city,
              state: address.state,
              country: address.country,
              postalCode: address.postalCode,
            },
          }
        : undefined,
    },
  });
  res.status(201).json({ success: true, hospital });
};

export const hospitalUpdate: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid hospital ID' });
    return;
  }

  const results = hospitalUpdateSchema.safeParse(req.body);
  if (!results.success) {
    res.status(400).json({ errors: results.error.format() });
    return;
  }

  const data = {
    ...results.data,
    address: results.data.address
      ? {
          update: {
            street: results.data.address.street,
            city: results.data.address.city,
            state: results.data.address.state,
            country: results.data.address.country,
            postalCode: results.data.address.postalCode,
          },
        }
      : undefined,
  };

  const updatedHospital = await prisma.hospital.update({
    where: { id },
    data,
  });

  res.json(updatedHospital);
};

export const hospitalDelete: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid hospital ID' });
    return;
  }

  await prisma.hospital.delete({
    where: { id },
  });

  res.status(204).send();
  return;
};
