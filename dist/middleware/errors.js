"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../lib/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`Error occurred: ${err.message}\nStack: ${err.stack}`);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message,
    });
};
exports.default = errorHandler;
