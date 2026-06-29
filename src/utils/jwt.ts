import jwt from "jsonwebtoken";
import { AuthUser } from "../types";

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || "innovexa_access_secret_key_12345";

const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "innovexa_refresh_secret_key_67890";

export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

export interface JwtPayload extends AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export const generateAccessToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch {
    throw new Error("Invalid refresh token");
  }
};