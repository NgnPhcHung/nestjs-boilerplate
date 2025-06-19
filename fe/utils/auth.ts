import { cookies } from "next/headers";

export async function setCookie() {
  (await cookies()).set("user", "some-value", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
