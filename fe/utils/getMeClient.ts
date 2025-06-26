"use client";

import { UserStorage } from "@/types/userStorage";

export const getMeClient = (): UserStorage => {
  const user = localStorage.getItem("user");
  if (!user) throw new Error("User not found in localStorage");

  return JSON.parse(user) as UserStorage;
};
