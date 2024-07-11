import { verify } from "jsonwebtoken";
import { User } from "../interfaces/User";
import { getUserByEmail } from "./user";
import bcrypt from "bcrypt";
import config from "../config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../error/Error";

// Function to login existing user and return access and refresh tokens
export async function login(body: Pick<User, "email" | "password">) {
  const existingUser = getUserByEmail(body.email);

  if (!existingUser) {
    throw new BadRequestError("User not found");
  }

  const isvalidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );

  if (!isvalidPassword) {
    throw new BadRequestError("Invalid password");
  }

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: existingUser.permissions,
    role: existingUser.role,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  return { accessToken, refreshToken };
}

// Function to refresh access token and refresh token using refresh token
export async function refresh(body: { refreshToken: string }) {
  try {
    const decoded = verify(body.refreshToken, config.jwt.secret!) as Pick<
      User,
      "id" | "name" | "email" | "permissions" | "role"
    >;

    // Extract the payload
    const { id, name, email, permissions, role } = decoded;
    const payload = { id, name, email, permissions, role };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedError("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new BadRequestError("Invalid token");
      }
    }
    throw new InternalServerError("Could not authenticate");
  }
}
