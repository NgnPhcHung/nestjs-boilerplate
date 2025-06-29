"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(key: string, value: string, age: number) {
  cookies().set(key, value, {
    httpOnly: true,
    path: "/",
    // maxAge: 60 * 60 * 24 * 7,
    maxAge: age,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
