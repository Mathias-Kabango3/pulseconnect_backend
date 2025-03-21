import { RequestHandler } from "express";
import { Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import dotevn from "dotenv";

dotevn.config();
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;

export const refreshToken = (req: Request, res: Response): any => {
  const token = req.body.refreshToken; // Refresh token sent in body

  if (!token) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }

  try {
    if (!JWT_REFRESH_TOKEN) {
      throw new Error("No refresh token secret provided.");
    }

    // Verify the refresh token
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN) as JwtPayload;

    // Generate a new access token
    if (!JWT_ACCESS_TOKEN) {
      throw new Error("No access token secret provided.");
    }
    if (decoded.exp) {
      throw new Error("Token has expired.");
    }

    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      JWT_ACCESS_TOKEN,
      { expiresIn: "15m" } // Adjust expiration as needed
    );

    return res.json({ accessToken });
  } catch (error) {
    // Explicitly check if the token has expired
    if (error instanceof TokenExpiredError) {
      return res
        .status(403)
        .json({ message: "Refresh token expired. Please log in again." });
    }

    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token." });
  }
};
