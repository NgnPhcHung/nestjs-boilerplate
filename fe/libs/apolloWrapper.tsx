"use client";

import { ApolloLink, split } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { setContext } from "@apollo/client/link/context";
import { PropsWithChildren } from "react";
import { graphQLError } from "./graphqlError";
import wsLink, { graphqlHttpLink } from "./graphqlHttpLink";
import { getMainDefinition } from "@apollo/client/utilities";

function makeClient(token?: string) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? token : "",
      },
    };
  });
  const link =
    typeof window === "undefined"
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          authLink,
          graphqlHttpLink,
        ])
      : ApolloLink.from([
          graphQLError, // Global GraphQL error handling link
          authLink, // Apply authentication to client requests
          split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            wsLink, // WebSocket link for subscriptions
            graphqlHttpLink, // HTTP link for queries and mutations
          ),
        ]);

  // Return the configured ApolloClient instance.
  return new ApolloClient({
    cache: new InMemoryCache(), // Caching mechanism for Apollo Client
    link, // The combined link for network operations
  });
}

interface IApolloWrapper extends PropsWithChildren {
  token?: string;
}
export function ApolloWrapper({ children, token }: IApolloWrapper) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient(token)}>
      {children}
    </ApolloNextAppProvider>
  );
}
