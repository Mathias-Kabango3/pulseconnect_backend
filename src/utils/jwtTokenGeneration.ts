import { $Enums } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

const JWT_ACCESS_TOKEN: string | undefined = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN: string | undefined = process.env.JWT_REFRESH_TOKEN;

if (!JWT_ACCESS_TOKEN) {
  throw new Error(
    'JWT_ACCESS_TOKEN is not defined in the environment variables.'
  );
}

export const generateAccessToken = (payload: {
  id: number;
  email: string;
  role: $Enums.UserRole;
}) => {
  const accessToken = jsonwebtoken.sign(payload, JWT_ACCESS_TOKEN, {
    expiresIn: '24h',
  });

  return accessToken;
};

export const generateRefreshToken = (payload: {
  id: number;
  email: string;
  role: $Enums.UserRole;
}) => {
  if (!JWT_REFRESH_TOKEN) {
    throw new Error(
      'JWT_REFRESH_TOKEN is not defined in the environment variables.'
    );
  }
  const refreshToken = jsonwebtoken.sign(payload, JWT_REFRESH_TOKEN, {
    expiresIn: '1m',
  });
  return refreshToken;
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jsonwebtoken.verify(token, JWT_ACCESS_TOKEN);
    return decoded as { id: number; email: string; role: $Enums.UserRole };
  } catch {
    throw new Error('Invalid access token.');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    if (!JWT_REFRESH_TOKEN) {
      throw new Error(
        'JWT_REFRESH_TOKEN is not defined in the environment variables.'
      );
    }
    const decoded = jsonwebtoken.verify(token, JWT_REFRESH_TOKEN);

    return decoded;
  } catch {
    throw new Error('Invalid refresh token.');
  }
  return null;
};
