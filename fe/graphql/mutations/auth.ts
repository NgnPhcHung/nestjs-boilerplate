"use server";

import { LoginDto } from "@/dtos";
import { getClient } from "@/libs/apolloClient";
import { decodeJwt } from "@/utils/decodeJwt";
import { setAuthCookie } from "@/utils/setAuthCookie";
import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
    }
  }
`;

const FIFTEEN_MINS = 15 * 60;

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
    setAuthCookie("authorization", accessToken, FIFTEEN_MINS);

    const user = decodeJwt(accessToken);
    return { success: true, message: "Login successful", data: user };
  } catch (error) {
    throw {
      success: false,
      message: (error as Error).message,
    };
  }
}
