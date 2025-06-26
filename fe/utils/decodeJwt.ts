import { UserStorage } from "@/types/userStorage";
import * as JWT from "jsonwebtoken";

export const decodeJwt = (token?: string) => {
  try {
    if (!token) return;
    const tk = token.includes("Bearer") ? token.split(" ")?.[1] : token;
    const decoded = JWT.verify(tk, process.env.JWT_ACCESS_SECRET || "secret");

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
