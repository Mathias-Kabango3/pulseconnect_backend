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
exports.refreshToken = exports.singlePatient = exports.deletePatient = exports.updatePatient = exports.loginUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwtTokenGeneration_1 = require("../utils/jwtTokenGeneration");
const hash_1 = require("../utils/hash");
const validation_1 = require("../utils/validations/validation");
// Create a user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validation_1.patientValidationSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: JSON.parse(result.error.message),
        });
        return;
    }
    // check if the user is already in  database
    const userExists = yield prisma_1.default.user.findUnique({
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
    const hashedPassword = yield (0, hash_1.hashPassword)(result.data.password);
    // create user in database
    const { email, firstName, lastName, dob, gender, address } = result.data;
    const newUser = yield prisma_1.default.user.create({
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
});
exports.createUser = createUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check for email and password
    if (!email || !password) {
        res
            .status(401)
            .json({ success: false, message: 'Invalid email or password' });
        return;
    }
    // Check if user exists
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        res
            .status(401)
            .json({ success: false, message: 'Invalid email or password' });
        return;
    }
    // Compare hashed password
    const isPasswordMatch = yield (0, hash_1.comparePassword)(password, user.password);
    if (!isPasswordMatch) {
        res
            .status(401)
            .json({ success: false, message: 'Invalid email or password' });
        return;
    }
    // Generate access and refresh tokens
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
});
exports.loginUser = loginUser;
// update patient
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const results = validation_1.patientUpdateValidation.safeParse(req.body);
    if (!results.success) {
        res.status(400).json({
            message: JSON.parse(results.error.message),
        });
        return;
    }
    const updatedPatient = yield prisma_1.default.user.update({
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
});
exports.updatePatient = updatePatient;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield prisma_1.default.patient.delete({ where: { id } });
    res
        .status(200)
        .json({ success: true, message: 'Patient deleted successfully' });
});
exports.deletePatient = deletePatient;
const singlePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const patient = yield prisma_1.default.patient.findUnique({
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
});
exports.singlePatient = singlePatient;
// Refresh token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res
            .status(401)
            .json({ success: false, message: 'No refresh token provided' });
        return;
    }
    const payload = (0, jwtTokenGeneration_1.verifyRefreshToken)(refreshToken);
    if (!payload) {
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
        return;
    }
    // Generate new access token
    const accessToken = (0, jwtTokenGeneration_1.generateAccessToken)({
        id: payload.id,
        email: payload.email,
        role: payload.role,
    });
    res.json({ success: true, accessToken });
});
exports.refreshToken = refreshToken;
