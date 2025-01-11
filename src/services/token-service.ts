import "dotenv/config";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";

export function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export function generateAccessTokenForClients(clientId: string) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  const accessToken = jwt.sign({ clientId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  return accessToken;
}

export function verifyAccessTokenForClients(accessToken: string) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  return payload;
}

export function generateRefreshToken() {
  const refreshToken = randomBytes(64).toString("hex");
  return refreshToken;
}
