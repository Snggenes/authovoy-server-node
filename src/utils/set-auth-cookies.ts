import { Response } from "express";

const setAuthCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.cookie("srt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sat", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });
};

export default setAuthCookies;
