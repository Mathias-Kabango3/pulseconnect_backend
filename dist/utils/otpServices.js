"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OTP_SECRET = process.env.OTP_SECRET || "supersecret"; // Keep this secure
// Generate OTP and store expiry
const generateOTP = () => {
    const otp = crypto_1.default.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours in seconds
    // Create a signed token with OTP and expiry
    const token = jsonwebtoken_1.default.sign({ otp, expiresAt }, OTP_SECRET, { expiresIn: "1d" });
    return { otp, token, expiresAt };
};
exports.generateOTP = generateOTP;
// Verify OTP
const verifyOTP = (token, userOTP) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, OTP_SECRET);
        if (decoded.expiresAt < Math.floor(Date.now() / 1000)) {
            return { valid: false, message: "OTP has expired" };
        }
        if (decoded.otp !== userOTP) {
            return { valid: false, message: "Invalid OTP" };
        }
        return { valid: true, message: "OTP verified successfully" };
    }
    catch (error) {
        return { valid: false, message: "Invalid or expired OTP token" };
    }
};
exports.verifyOTP = verifyOTP;
