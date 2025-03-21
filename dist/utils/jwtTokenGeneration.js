"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
if (!JWT_ACCESS_TOKEN) {
    throw new Error('JWT_ACCESS_TOKEN is not defined in the environment variables.');
}
const generateAccessToken = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, JWT_ACCESS_TOKEN, {
        expiresIn: '24h',
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    if (!JWT_REFRESH_TOKEN) {
        throw new Error('JWT_REFRESH_TOKEN is not defined in the environment variables.');
    }
    const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_TOKEN, {
        expiresIn: '1m',
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_TOKEN);
        return decoded;
    }
    catch (_a) {
        throw new Error('Invalid access token.');
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        if (!JWT_REFRESH_TOKEN) {
            throw new Error('JWT_REFRESH_TOKEN is not defined in the environment variables.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN);
        return decoded;
    }
    catch (_a) {
        throw new Error('Invalid refresh token.');
    }
    return null;
};
exports.verifyRefreshToken = verifyRefreshToken;
