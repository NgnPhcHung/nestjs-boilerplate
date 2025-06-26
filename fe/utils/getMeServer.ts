"use server";

import { cookies } from "next/headers";
import * as JWT from "jsonwebtoken";
import { UserStorage } from "@/types/userStorage";

export const getMeServer = async (): Promise<UserStorage | undefined> => {
  try {
    const token = cookies().get("authorization")?.value;

    if (!token) return;

    const decoded = JWT.verify(
      token.split(" ")?.[1],
      process.env.JWT_ACCESS_SECRET || "secret",
    );

    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      const user = decoded.sub;
      if (typeof user === "string") return JSON.parse(user) as UserStorage;
      if (typeof user === "object") return user as UserStorage;
    }
  } catch (error) {
    console.error("Error token", error);

    return;
  }
};
