import { HttpLink } from "@apollo/client";

export const graphqlHttpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
  fetchOptions: { cache: "no-store" },
});
