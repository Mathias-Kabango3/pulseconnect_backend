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
exports.refreshToken = exports.getDoctorsAppointments = exports.getDoctorsByCity = exports.getDoctorsBySpecialty = exports.getDoctorsByHospital = exports.getAllDoctors = exports.getDoctorById = exports.deleteDoctor = exports.updateDoctor = exports.login = exports.createDoctor = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const hash_1 = require("../utils/hash");
const jwtTokenGeneration_1 = require("../utils/jwtTokenGeneration");
const jwtTokenGeneration_2 = require("../utils/jwtTokenGeneration");
const validation_1 = require("../utils/validations/validation");
const createDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = validation_1.doctorRegistrationValidation.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.error.flatten(),
        });
        return;
    }
    const adminId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '';
    if (!adminId) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
    }
    const admin = yield prisma_1.default.hospitalAdmin.findFirst({
        where: { userId: adminId },
        select: {
            hospitalId: true,
        },
    });
    if (!(admin === null || admin === void 0 ? void 0 : admin.hospitalId)) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
    }
    const { email, password, firstName, lastName, role, gender, phoneNumber, speciality, licenseNumber, address, availableFrom, availableTo, } = result.data;
    const hashedPassword = yield (0, hash_1.hashPassword)(password);
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (user) {
        res.status(400).json({ errors: [{ message: 'Email already exists' }] });
        return;
    }
    const newUser = yield prisma_1.default.user.create({
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
});
exports.createDoctor = createDoctor;
// login with email and password
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Missing email or password' });
        return;
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const isPasswordValid = yield (0, hash_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const accessToken = (0, jwtTokenGeneration_1.generateAccessToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, jwtTokenGeneration_1.generateRefreshToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
    });
});
exports.login = login;
// update doctor
const updateDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const { email, firstName, lastName, phoneNumber } = req.body;
    const doctor = yield prisma_1.default.doctor.update({
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
});
exports.updateDoctor = updateDoctor;
// delete doctor
const deleteDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doctor = yield prisma_1.default.doctor.delete({
        where: { id: parseInt(id) },
    });
    if (!doctor) {
        res.status(404).json({ message: 'Doctor not found' });
        return;
    }
    res.json({ message: 'Doctor deleted successfully' });
});
exports.deleteDoctor = deleteDoctor;
// get doctor by id
const getDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doctor = yield prisma_1.default.doctor.findUnique({
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
});
exports.getDoctorById = getDoctorById;
// get all doctors
const getAllDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctors = yield prisma_1.default.doctor.findMany({
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
});
exports.getAllDoctors = getAllDoctors;
// get doctors by hospital
const getDoctorsByHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '';
    if (!adminId) {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }
    const hospital = yield prisma_1.default.hospitalAdmin.findFirst({
        where: { userId: adminId },
        select: { hospitalId: true },
    });
    if (!hospital) {
        res.status(404).json({ message: 'Hospital not found' });
        return;
    }
    const doctors = yield prisma_1.default.doctor.findMany({
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
});
exports.getDoctorsByHospital = getDoctorsByHospital;
// get doctors by specialty
const getDoctorsBySpecialty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { speciality } = req.params;
    const doctors = yield prisma_1.default.doctor.findMany({
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
});
exports.getDoctorsBySpecialty = getDoctorsBySpecialty;
// get doctors by city
const getDoctorsByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city } = req.params;
    const cityAddress = yield prisma_1.default.address.findFirst({
        where: { city },
        select: { id: true },
    });
    const doctors = yield prisma_1.default.doctor.findMany({
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
});
exports.getDoctorsByCity = getDoctorsByCity;
// get doctors appintments
const getDoctorsAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doctorId = yield prisma_1.default.doctor.findFirst({
        where: { userId: parseInt(id) },
        select: { id: true },
    });
    if (!doctorId) {
        res.status(404).json({ message: 'Doctor not found' });
        return;
    }
    const appointments = yield prisma_1.default.appointment.findMany({
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
});
exports.getDoctorsAppointments = getDoctorsAppointments;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }
    const payload = (0, jwtTokenGeneration_2.verifyRefreshToken)(refreshToken);
    if (!payload) {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
    }
    // Generate new access token
    const accessToken = (0, jwtTokenGeneration_1.generateAccessToken)({
        id: payload.id,
        email: payload.email,
        role: payload.role,
    });
    res.json({ accessToken });
});
exports.refreshToken = refreshToken;
