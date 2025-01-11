import "dotenv/config";
import { Router } from "express";
import bcrypt from "bcrypt";

import { ClientModel } from "../models";
import { registerSchema, verifyEmailSchema, loginSchema } from "../schemas";
import { sendVerificationEmail } from "../services/email-service";
import {
  generateAccessTokenForClients,
  generateDeviceId,
  generateSixDigitNumber,
  verifyAccessTokenForClients,
} from "../services/token-service";
import { generateAndSaveTokens, setAuthCookies } from "../utils";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = registerSchema.safeParse({ email, password });
    if (!data.success) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const existingClient = await ClientModel.findOne({ email });
    if (existingClient) {
      res.status(400).json({ message: "Client already exists" });
      return;
    }

    const emailVerificationNumber = generateSixDigitNumber();
    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = new ClientModel({
      email,
      passwordHash: passwordHash,
      emailVerificationNumber,
      emailVerificationNumberExpires: new Date(Date.now() + 60000 * 5),
    });

    await newClient.save();

    const result = await sendVerificationEmail(email, emailVerificationNumber);
    if (!result.success) {
      res.status(500).json({ message: "Failed to send verification email" });
      return;
    }

    res.status(201).json({ message: "Client created" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-email", async (req, res, next) => {
  try {
    const { email, emailVerificationNumber } = req.body;

    const data = verifyEmailSchema.safeParse({
      email,
      emailVerificationNumber,
    });
    if (!data.success) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const client = await ClientModel.findOne({
      email,
      emailVerificationNumber,
    });

    if (!client) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    if (!client.emailVerificationNumberExpires) {
      res.status(400).json({ message: "Verification code expired" });
      return;
    }

    if (client.emailVerificationNumberExpires < new Date()) {
      res.status(400).json({ message: "Verification code expired" });
      return;
    }

    client.isEmailVerified = true;
    client.emailVerificationNumber = null;
    client.emailVerificationNumberExpires = null;

    await client.save();

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = loginSchema.safeParse({ email, password });
    if (!data.success) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const client = await ClientModel.findOne({ email });
    if (!client) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    if (!client.isEmailVerified) {
      res.status(400).json({ message: "Email not verified" });
      return;
    }

    if (!client.passwordHash) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, client.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const userAgent = req.headers["user-agent"];
    console.log("userAgent", userAgent);
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("ipAddress", ipAddress);
    let deviceId = req.cookies.sdi;
    console.log("deviceId", deviceId);

    if (!deviceId) {
      deviceId = generateDeviceId();
      res.cookie("sdi", deviceId, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
    }

    const { accessToken, refreshToken } = await generateAndSaveTokens(
      userAgent,
      ipAddress,
      client._id,
      deviceId
    );

    client.lastLoginAt = new Date();
    client.lastLoginIp = ipAddress as string;

    await client.save();

    setAuthCookies(accessToken, refreshToken, res);

    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    const accessToken = req.cookies.sat;
    console.log("accessToken", accessToken);

    if (accessToken) {
      const payload = verifyAccessTokenForClients(accessToken);
      if (payload.success) {
        // @ts-ignore
        const clientId = payload.data.clientId;

        const client = await ClientModel.findById(clientId);
        if (!client) {
          res.status(400).json({ message: "Client not found" });
          return;
        }

        const newAccessToken = generateAccessTokenForClients(clientId);

        res.cookie("sat", newAccessToken, {
          maxAge: 1000 * 60 * 15,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
        });

        const {
          passwordHash,
          emailVerificationNumber,
          emailVerificationNumberExpires,
          passwordResetToken,
          passwordResetTokenExpires,
          lastLoginAt,
          lastLoginIp,
          createdAt,
          updatedAt,
          ...clientWithoutSensitiveData
        } = client.toObject();

        console.log("clientWithoutSensitiveData", clientWithoutSensitiveData);

        res.status(200).json(clientWithoutSensitiveData);
        return;
      }
    }

    res.status(200).json({ message: "Profile" });
  } catch (error) {
    next(error);
  }
});

export default router;
