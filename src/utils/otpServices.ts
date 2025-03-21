import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const OTP_SECRET = process.env.OTP_SECRET || "supersecret"; // Keep this secure

interface OTPPayload {
  otp: string;
  expiresAt: number; // Unix timestamp
}

// Generate OTP and store expiry
export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours in seconds

  // Create a signed token with OTP and expiry
  const token = jwt.sign({ otp, expiresAt }, OTP_SECRET, { expiresIn: "1d" });

  return { otp, token, expiresAt };
};

// Verify OTP
export const verifyOTP = (token: string, userOTP: string) => {
  try {
    const decoded = jwt.verify(token, OTP_SECRET) as OTPPayload;

    if (decoded.expiresAt < Math.floor(Date.now() / 1000)) {
      return { valid: false, message: "OTP has expired" };
    }

    if (decoded.otp !== userOTP) {
      return { valid: false, message: "Invalid OTP" };
    }

    return { valid: true, message: "OTP verified successfully" };
  } catch (error) {
    return { valid: false, message: "Invalid or expired OTP token" };
  }
};
