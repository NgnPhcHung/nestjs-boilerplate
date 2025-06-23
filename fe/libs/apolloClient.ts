import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { graphQLError } from "./graphqlError";
import { graphqlHttpLink } from "./graphqlHttpLink";

export const { getClient } = registerApolloClient(() => {
  const link = ApolloLink.from([graphQLError, graphqlHttpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
});
