import { RefreshTokenClientModel } from "../models";
import { TClient } from "../models/client";
import {
  generateAccessTokenForClients,
  generateRefreshToken,
} from "../services/token-service";

const generateAndSaveTokens = async (
  userAgent: string | undefined,
  ipAddress: string | string[] | undefined,
  clientId: string,
  deviceId: string | undefined
) => {
  const accessToken = generateAccessTokenForClients(clientId);
  const refreshToken = generateRefreshToken();

  const refreshTokenDoc = await RefreshTokenClientModel.findOne({
    deviceId,
    revokedAt: null,
    replacedByToken: null,
    clientId: clientId,
  });

  if (refreshTokenDoc && refreshTokenDoc.expiresAt.getTime() < Date.now()) {
    refreshTokenDoc.revokedAt = new Date();
    refreshTokenDoc.replacedByToken = refreshToken;
    await refreshTokenDoc.save();
  }

  if (refreshTokenDoc) {
    refreshTokenDoc.revokedAt = new Date();
    refreshTokenDoc.replacedByToken = refreshToken;
    await refreshTokenDoc.save();
  }

  const newRefreshTokenDoc = new RefreshTokenClientModel({
    token: refreshToken,
    clientId: clientId,
    deviceId,
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress,
    userAgent,
  });
  await newRefreshTokenDoc.save();

  return { accessToken, refreshToken };
};

export default generateAndSaveTokens;
