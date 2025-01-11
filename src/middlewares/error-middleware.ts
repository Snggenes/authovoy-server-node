import { NextFunction, Request, Response } from "express";

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errorMessage = "Internal server error";
  let statusCode = 500;
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
}