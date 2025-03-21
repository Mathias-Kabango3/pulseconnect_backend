"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaSingleton {
    constructor() { } // Private constructor to prevent direct instantiation
    static getInstance() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new client_1.PrismaClient();
        }
        return PrismaSingleton.instance;
    }
}
const prisma = PrismaSingleton.getInstance();
exports.default = prisma;
