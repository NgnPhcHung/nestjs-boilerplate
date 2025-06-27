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
          graphQLError,
          authLink,
          split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            wsLink,
            graphqlHttpLink,
          ),
        ]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
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
