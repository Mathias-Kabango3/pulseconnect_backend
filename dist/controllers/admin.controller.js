"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAppointments = exports.createAdmin = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const validation_1 = require("../utils/validations/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input data
    const validatedData = validation_1.createAdminSchema.safeParse(req.body);
    if (!validatedData.success) {
        res.status(400).json({ errors: validatedData.error });
        return;
    }
    // Check if user already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: validatedData.data.email },
    });
    if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
    }
    // Check if the hospital exists
    const hospital = yield prisma_1.default.hospital.findUnique({
        where: { id: validatedData.data.hospitalId },
    });
    if (!hospital) {
        res.status(404).json({ message: 'Hospital not found' });
        return;
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(validatedData.data.password, 10);
    // Create the admin user
    const newAdmin = yield prisma_1.default.user.create({
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
    yield prisma_1.default.hospitalAdmin.create({
        data: {
            userId: newAdmin.id,
            hospitalId: validatedData.data.hospitalId,
        },
    });
    res.status(201).json({
        message: 'Admin created and added to hospital successfully',
        admin: newAdmin,
    });
});
exports.createAdmin = createAdmin;
// Get all the appointments for the hospital
const allAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    // Get hospital ID from hospitalAdmin table
    const hospitalAdmin = yield prisma_1.default.hospitalAdmin.findFirst({
        where: { userId: parseInt(id) },
        select: { hospitalId: true },
    });
    if (!hospitalAdmin) {
        res.status(404).json({ error: 'Hospital not found for this admin' });
        return;
    }
    // Fetch appointments along with relevant details
    const appointments = yield prisma_1.default.appointment.findMany({
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
});
exports.allAppointments = allAppointments;
