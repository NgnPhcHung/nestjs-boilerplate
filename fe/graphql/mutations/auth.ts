"use server";

import { getClient } from "@/libs/apolloClient";
import { ApolloError, gql } from "@apollo/client";
import { cookies } from "next/headers";

const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export async function userLogin(body: { username: string; password: string }) {
  console.log("--- userLogin Server Action Started ---"); // VERY FIRST LOG

  try {
    console.log(
      `Payload received: username=${body.username}, password=${body.password ? "*****" : "N/A"}`,
    ); // Log extracted data
    console.log("Attempting GraphQL mutation..."); // Log BEFORE the Apollo call

    const { data, errors } = await getClient().mutate<{
      login: { accessToken: string };
    }>({
      mutation: LOGIN_MUTATION,
      variables: { input: body },
    });

    console.log("GraphQL mutation completed."); // Log AFTER the Apollo call

    if (errors) {
      console.error("GraphQL errors from server:", errors);
      console.log("--- userLogin Server Action Ended (GraphQL Errors) ---");
      return {
        success: false,
        message: `Login failed: ${errors.map((e) => e.message).join(", ")}`,
      };
    }

    if (!data || !data.login || !data.login.accessToken) {
      console.error(
        "Login failed: No access token received from GraphQL server (data or accessToken missing).",
      );
      console.log("--- userLogin Server Action Ended (No Access Token) ---");
      return {
        success: false,
        message: "Login failed: Invalid credentials or server error.",
      };
    }

    const accessToken = data.login.accessToken;
    const expiresInSeconds = 15 * 60;

    const cookieStore = cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
      path: "/",
    });

    console.log("Login successful. Setting cookie.");
    console.log("--- userLogin Server Action Ended (Success) ---");
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Critical unhandled error within userLogin:", error);

    let errorMessage = "An unknown error occurred during login.";
    let detailedErrors: string[] = [];

    if (error instanceof ApolloError) {
      console.error("Caught an ApolloError.");

      // Prioritize GraphQL errors if they are directly available on the ApolloError object
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        detailedErrors = error.graphQLErrors.map((e) => e.message);
        errorMessage = `Login failed: ${detailedErrors.join(", ")}`;
        console.error(
          "Specific GraphQL Errors (from graphQLErrors):",
          detailedErrors,
        );
      } else if (error.networkError) {
        // If it's a network error, check its 'result' property for GraphQL errors
        const networkResult = (error.networkError as any).result; // Cast to any to access 'result'
        if (
          networkResult &&
          networkResult.errors &&
          Array.isArray(networkResult.errors) &&
          networkResult.errors.length > 0
        ) {
          // These are the errors that cause the 400 typically from NestJS ValidationPipe
          detailedErrors = networkResult.errors.map(
            (e: any) =>
              e.message || "Unknown GraphQL error in network response",
          );
          errorMessage = `Login failed: ${detailedErrors.join(", ")}`;
          console.error(
            "Specific GraphQL Errors (from networkError.result):",
            detailedErrors,
          );
        } else {
          // Fallback for network errors without a structured GraphQL error body
          errorMessage = `Login failed due to network issue: ${error.networkError.message || "No specific message"}`;
          console.error("Network Error Details:", error.networkError);
        }
      } else {
        // Generic Apollo error, but not specifically a GraphQL error or network error
        errorMessage = `Login failed: ${error.message}`;
        console.error("Generic Apollo Error Message:", error.message);
      }
    } else if (error instanceof Error) {
      errorMessage = `Login failed: ${error.message}`;
      console.error("Standard Error Message:", error.message);
    }

    console.log("--- userLogin Server Action Ended (Unhandled Error) ---");
    return {
      success: false,
      message: errorMessage,
      // You might also return the detailedErrors array for client-side display
      // detailedErrors: detailedErrors,
    };
  }
}
