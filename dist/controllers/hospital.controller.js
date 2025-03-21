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
exports.hospitalDelete = exports.hospitalUpdate = exports.hospitalRegistration = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const validation_1 = require("../utils/validations/validation");
const hospitalRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = validation_1.hospitalRegistrationValidation.safeParse(req.body);
    if (!results.success) {
        res.status(400).json({ success: false, errors: results.error.format() });
        return;
    }
    const { name, email, address, phone, website, description, emergencyContact, registrationNumber, openingHours, services, departments, bedCapacity, availableBeds, acceptedInsuranceProviders, rating, totalReviews, operatingStatus, verifiedBy, facilities, queueSystem, telemedicine, } = results.data;
    const hospitalExists = yield prisma_1.default.hospital.findUnique({
        where: { registrationNumber },
    });
    if (hospitalExists) {
        res
            .status(400)
            .json({ success: false, message: 'Hospital already registered' });
        return;
    }
    const hospital = yield prisma_1.default.hospital.create({
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
});
exports.hospitalRegistration = hospitalRegistration;
const hospitalUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid hospital ID' });
        return;
    }
    const results = validation_1.hospitalUpdateSchema.safeParse(req.body);
    if (!results.success) {
        res.status(400).json({ errors: results.error.format() });
        return;
    }
    const data = Object.assign(Object.assign({}, results.data), { address: results.data.address
            ? {
                update: {
                    street: results.data.address.street,
                    city: results.data.address.city,
                    state: results.data.address.state,
                    country: results.data.address.country,
                    postalCode: results.data.address.postalCode,
                },
            }
            : undefined });
    const updatedHospital = yield prisma_1.default.hospital.update({
        where: { id },
        data,
    });
    res.json(updatedHospital);
});
exports.hospitalUpdate = hospitalUpdate;
const hospitalDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid hospital ID' });
        return;
    }
    yield prisma_1.default.hospital.delete({
        where: { id },
    });
    res.status(204).send();
    return;
});
exports.hospitalDelete = hospitalDelete;
