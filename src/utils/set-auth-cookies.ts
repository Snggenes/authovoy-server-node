import { Response } from "express";
import "dotenv/config";

const setAuthCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.cookie("srt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.cookie("sat", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

export default setAuthCookies;
