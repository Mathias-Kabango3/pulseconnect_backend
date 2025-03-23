import { z } from 'zod';

// patient validation
export const patientValidationSchema = z.object({
  firstName: z.string({ message: 'first name is required' }),
  lastName: z.string({ message: 'last name is required' }),
  middleName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string({ message: 'gender is required' }),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).default('PATIENT'),
  idNumber: z.string().optional(),
  hospitalId: z.number().int().optional(),
  isApproved: z.boolean().default(false),
  verificationDocument: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default('Zimbabwe'),
    })
    .optional(),
});
// patient update validation

export const patientUpdateValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
  idNumber: z.string().optional(),
  hospitalId: z.number().int().optional(),
  isApproved: z.boolean().optional(),
  verificationDocument: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default('Zimbabwe'),
    })
    .optional(),
});

// patient login validation

export const LoginValidation = z.object({
  email: z.string().email({ message: 'invalid email' }),
  password: z.string(),
});

// doctor registration validation
export const doctorRegistrationValidation = z.object({
  firstName: z.string({ message: 'first name is required' }),
  lastName: z.string({ message: 'last name is required' }),
  middleName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string({ message: 'gender is required' }),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['DOCTOR', 'ADMIN']).default('DOCTOR'),
  idNumber: z.string().optional(),
  isApproved: z.boolean().default(true),
  verificationDocument: z.string().optional(),
  phoneNumber: z.string(),
  speciality: z.string(),
  availableFrom: z.string(),
  availableTo: z.string(),
  licenseNumber: z.string(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default('Zimbabwe'),
    })
    .optional(),
});

// hospital registration validation
export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
});
export const hospitalRegistrationValidation = z.object({
  name: z.string().min(1, 'Hospital name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url().optional(),
  description: z.string().optional(),
  emergencyContact: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  imageUrl: z.string().url().optional(),
  openingHours: z.string().optional(),
  services: z.array(z.string()).optional(),
  departments: z.array(z.string()).optional(),
  bedCapacity: z.number().int().positive().optional(),
  availableBeds: z.number().int().nonnegative().optional(),
  acceptedInsuranceProviders: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).default(0).optional(),
  totalReviews: z.number().int().nonnegative().default(0).optional(),
  operatingStatus: z.enum(['Open', 'Closed']).default('Open'),
  verifiedBy: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  queueSystem: z.boolean().default(true),
  telemedicine: z.boolean().default(false),
  address: addressSchema.optional(),
});

export const hospitalUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  address: addressSchema.optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  emergencyContact: z.string().optional(),
  registrationNumber: z.string().optional(),
  imageUrl: z.string().url().optional(),
  openingHours: z.string().optional(),
  services: z.array(z.string()).optional(),
  departments: z.array(z.string()).optional(),
  bedCapacity: z.number().int().positive().optional(),
  availableBeds: z.number().int().nonnegative().optional(),
  acceptedInsuranceProviders: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().int().nonnegative().optional(),
  operatingStatus: z.enum(['Open', 'Closed']).optional(),
  verifiedBy: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  queueSystem: z.boolean().optional(),
  telemedicine: z.boolean().optional(),
});
export const createAdminSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  hospitalId: z.number().int().positive('Invalid hospital ID'),
  role: z.enum(['ADMIN']).default('ADMIN'),
  gender: z.string(),
  address: addressSchema.optional(),
});
