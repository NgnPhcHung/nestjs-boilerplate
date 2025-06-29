import { setCookie } from "cookies-next";

const FIFTEEN_MINS = 15 * 60;

export const setAuthToken = (accessToken: string) => {
  setCookie("authorization", `Bearer ${accessToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: FIFTEEN_MINS,
    path: "/",
  });
};
