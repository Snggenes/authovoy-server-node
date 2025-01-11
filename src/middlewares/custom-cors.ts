import { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import "dotenv/config";
import { compareOrigins } from "../utils";

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
  console.log("origin", origin);

  const isDev = process.env.NODE_ENV === "development";

  const options: CorsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
      if (isDev) {
        callback(null, true);
        return;
      }

      if (!origin || !compareOrigins(origin, clientUrl)) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  cors(options)(req, res, next);
}
