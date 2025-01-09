import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export default function customCors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  const origin = req.headers.origin;
  if (!origin || origin !== clientUrl) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, application/json");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
}
