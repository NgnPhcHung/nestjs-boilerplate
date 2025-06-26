"use server";

import { LoginDto } from "@/dtos";
import { getClient } from "@/libs/apolloClient";
import { decodeJwt } from "@/utils/decodeJwt";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";

const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export async function userLogin(body: LoginDto) {
  try {
    const { data } = await getClient().mutate<{
      login: { accessToken: string };
    }>({
      mutation: LOGIN_MUTATION,
      variables: { input: body },
    });

    if (!data || !data.login || !data.login.accessToken) {
      return {
        success: false,
        message: "Login failed: Invalid credentials or server error.",
      };
    }

    const accessToken = data.login.accessToken;
    const expiresInSeconds = 15 * 60;

    const cookieStore = cookies();
    cookieStore.set("authorization", `Bearer ${accessToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
      path: "/",
    });

    const user = decodeJwt(accessToken);

    return { success: true, message: "Login successful", data: user };
  } catch (error) {
    throw {
      success: false,
      message: (error as Error).message,
    };
  }
}
