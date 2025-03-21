"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const refreshToken = (req, res) => {
    const token = req.body.refreshToken; // Refresh token sent in body
    if (!token) {
        return res.status(401).json({ message: "Refresh Token is required" });
    }
    try {
        if (!JWT_REFRESH_TOKEN) {
            throw new Error("No refresh token secret provided.");
        }
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN);
        // Generate a new access token
        if (!JWT_ACCESS_TOKEN) {
            throw new Error("No access token secret provided.");
        }
        if (decoded.exp) {
            throw new Error("Token has expired.");
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, JWT_ACCESS_TOKEN, { expiresIn: "15m" } // Adjust expiration as needed
        );
        return res.json({ accessToken });
    }
    catch (error) {
        // Explicitly check if the token has expired
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res
                .status(403)
                .json({ message: "Refresh token expired. Please log in again." });
        }
        return res
            .status(403)
            .json({ message: "Invalid or expired refresh token." });
    }
};
exports.refreshToken = refreshToken;
