import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../interfaces/domain.interface';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateAccessToken = (payload: IJWTPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

export const generateRefreshToken = (payload: IJWTPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh-secret', {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return token;
};

export const verifyAccessToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as IJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as IJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getRefreshTokenExpiry = (): Date => {
  const expiryMs = 7 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + expiryMs);
};
