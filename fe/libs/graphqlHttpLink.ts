import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const graphqlHttpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
  fetchOptions: {
    cache: "no-store",
    credentials: "include",
  },
  credentials: "include",
});

export const graphqlWs = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3001/graphql",
  }),
);
let wsLink: ApolloLink;

if (typeof window !== "undefined") {
  wsLink = graphqlWs as unknown as ApolloLink;
} else {
  wsLink = graphqlHttpLink as ApolloLink;
}
export default wsLink;
