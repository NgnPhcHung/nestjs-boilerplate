import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  ApolloLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// User-provided HTTP Link configuration
export const graphqlHttpLink = new HttpLink({
  uri: "http://localhost:3001/graphql", // Updated to port 3001 as per user's input
  fetchOptions: { cache: "no-store" }, // Added fetchOptions as per user's input
});

// User-provided WebSocket Link configuration
// Note: The `url` here is is for the WebSocket endpoint for subscriptions.
export const graphqlWs = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3001/graphql", // Using port 3000 for WS as per user's input
  }),
);

// Create a WebSocket link that is conditionally used only on the client-side.
// This is crucial because `WebSocket` and `window` objects are not available
// during server-side rendering (SSR).
let wsLink: ApolloLink; // Explicitly type as ApolloLink

if (typeof window !== "undefined") {
  // If we are in the browser, use the provided GraphQLWsLink
  // Cast it to ApolloLink to satisfy type checker, as ApolloLink is the base type
  wsLink = graphqlWs as unknown as ApolloLink;
} else {
  // If we are on the server (during SSR), subscriptions won't work anyway.
  // We provide the httpLink as a fallback.
  // Casting it to ApolloLink to satisfy the split function's type requirements.
  wsLink = graphqlHttpLink as ApolloLink;
}
export default wsLink;
