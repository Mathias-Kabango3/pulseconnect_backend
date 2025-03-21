"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminSchema = exports.hospitalUpdateSchema = exports.hospitalRegistrationValidation = exports.addressSchema = exports.doctorRegistrationValidation = exports.LoginValidation = exports.patientUpdateValidation = exports.patientValidationSchema = void 0;
const zod_1 = require("zod");
// patient validation
exports.patientValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string({ message: 'first name is required' }),
    lastName: zod_1.z.string({ message: 'last name is required' }),
    middleName: zod_1.z.string().optional(),
    dob: zod_1.z.date().optional(),
    gender: zod_1.z.string({ message: 'gender is required' }),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    role: zod_1.z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).default('PATIENT'),
    idNumber: zod_1.z.string().optional(),
    hospitalId: zod_1.z.number().int().optional(),
    isApproved: zod_1.z.boolean().default(false),
    verificationDocument: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().default('Zimbabwe'),
    })
        .optional(),
});
// patient update validation
exports.patientUpdateValidation = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    middleName: zod_1.z.string().optional(),
    dob: zod_1.z.date().optional(),
    gender: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().optional(),
    role: zod_1.z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional(),
    idNumber: zod_1.z.string().optional(),
    hospitalId: zod_1.z.number().int().optional(),
    isApproved: zod_1.z.boolean().optional(),
    verificationDocument: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().default('Zimbabwe'),
    })
        .optional(),
});
// patient login validation
exports.LoginValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'invalid email' }),
    password: zod_1.z.string(),
});
// doctor registration validation
exports.doctorRegistrationValidation = zod_1.z.object({
    firstName: zod_1.z.string({ message: 'first name is required' }),
    lastName: zod_1.z.string({ message: 'last name is required' }),
    middleName: zod_1.z.string().optional(),
    dob: zod_1.z.date().optional(),
    gender: zod_1.z.string({ message: 'gender is required' }),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    role: zod_1.z.enum(['DOCTOR', 'ADMIN']).default('DOCTOR'),
    idNumber: zod_1.z.string().optional(),
    isApproved: zod_1.z.boolean().default(true),
    verificationDocument: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string(),
    speciality: zod_1.z.string(),
    availableFrom: zod_1.z.string().optional(),
    availableTo: zod_1.z.string().optional(),
    licenseNumber: zod_1.z.string(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().default('Zimbabwe'),
    })
        .optional(),
});
// hospital registration validation
exports.addressSchema = zod_1.z.object({
    street: zod_1.z.string(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    country: zod_1.z.string(),
    postalCode: zod_1.z.string(),
});
exports.hospitalRegistrationValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Hospital name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    phone: zod_1.z.string().min(1, 'Phone number is required'),
    website: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().min(1, 'Registration number is required'),
    imageUrl: zod_1.z.string().url().optional(),
    openingHours: zod_1.z.string().optional(),
    services: zod_1.z.array(zod_1.z.string()).optional(),
    departments: zod_1.z.array(zod_1.z.string()).optional(),
    bedCapacity: zod_1.z.number().int().positive().optional(),
    availableBeds: zod_1.z.number().int().nonnegative().optional(),
    acceptedInsuranceProviders: zod_1.z.array(zod_1.z.string()).optional(),
    rating: zod_1.z.number().min(0).max(5).default(0).optional(),
    totalReviews: zod_1.z.number().int().nonnegative().default(0).optional(),
    operatingStatus: zod_1.z.enum(['Open', 'Closed']).default('Open'),
    verifiedBy: zod_1.z.string().optional(),
    facilities: zod_1.z.array(zod_1.z.string()).optional(),
    queueSystem: zod_1.z.boolean().default(true),
    telemedicine: zod_1.z.boolean().default(false),
    address: exports.addressSchema.optional(),
});
exports.hospitalUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    address: exports.addressSchema.optional(),
    phone: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    openingHours: zod_1.z.string().optional(),
    services: zod_1.z.array(zod_1.z.string()).optional(),
    departments: zod_1.z.array(zod_1.z.string()).optional(),
    bedCapacity: zod_1.z.number().int().positive().optional(),
    availableBeds: zod_1.z.number().int().nonnegative().optional(),
    acceptedInsuranceProviders: zod_1.z.array(zod_1.z.string()).optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    totalReviews: zod_1.z.number().int().nonnegative().optional(),
    operatingStatus: zod_1.z.enum(['Open', 'Closed']).optional(),
    verifiedBy: zod_1.z.string().optional(),
    facilities: zod_1.z.array(zod_1.z.string()).optional(),
    queueSystem: zod_1.z.boolean().optional(),
    telemedicine: zod_1.z.boolean().optional(),
});
exports.createAdminSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters long'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    phoneNumber: zod_1.z.string().min(10, 'Phone number must be at least 10 digits'),
    hospitalId: zod_1.z.number().int().positive('Invalid hospital ID'),
    role: zod_1.z.enum(['ADMIN']).default('ADMIN'),
    gender: zod_1.z.string(),
    address: exports.addressSchema.optional(),
});
