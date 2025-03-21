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
Object.defineProperty(exports, "__esModule", { value: true });
const server_sdk_1 = require("@vonage/server-sdk");
const auth_1 = require("@vonage/auth");
const auth = new auth_1.Auth({
    apiKey: "72142600",
    apiSecret: "ulfGlS0Pl4K0b8hY",
});
const vonage = new server_sdk_1.Vonage(auth);
function sendSMS(to, from, text) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vonage.sms
            .send({ to, from, text })
            .then((resp) => {
            console.log("Message sent successfully");
            console.log(resp);
        })
            .catch((err) => {
            console.log("There was an error sending the messages.");
            console.error(err);
        });
    });
}
exports.default = sendSMS;
