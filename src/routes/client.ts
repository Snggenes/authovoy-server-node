import "dotenv/config";
import { Router } from "express";

import { ClientModel } from "../models";
import { registerSchema, verifyEmailSchema, loginSchema } from "../schemas";
import { sendVerificationEmail } from "../services/email-service";
import { generateSixDigitNumber } from "../services/token-service";

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

    const newClient = new ClientModel({
      email,
      passwordHash: password,
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

// router.post("/login", async (req, res, next) => {
//   try {

//     const { email, password } = req.body;

//     const data = loginSchema.safeParse({ email, password });
//     if (!data.success) {
//       res.status(400).json({ message: "Invalid data" });
//       return;
//     }

//     const client = await ClientModel.findOne({ email });
//     if (!client) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }

//   } catch (error) {
//     next(error);
//   }
// });

export default router;
