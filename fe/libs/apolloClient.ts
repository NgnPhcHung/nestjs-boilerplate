import {
  GraphQLExtensions,
  GraphqlCustomError,
  NetworkOperationError,
} from "@/types/graphql";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { onError } from "@apollo/client/link/error";

export const { getClient } = registerApolloClient(() => {
  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      let finalErrorToPropagate: Error | null = null;

      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          const extensions = err.extensions as GraphQLExtensions | undefined;
          const outerExceptionWrapper = extensions?.exception;
          const innerServerExceptionDetails = outerExceptionWrapper?.exception;

          if (innerServerExceptionDetails?.statusCode === 401) {
          }

          if (innerServerExceptionDetails) {
            finalErrorToPropagate = new GraphqlCustomError(
              innerServerExceptionDetails,
              err.message,
            );
            break;
          }
        }

        if (!finalErrorToPropagate && graphQLErrors.length > 0) {
          finalErrorToPropagate = new GraphqlCustomError(
            undefined,
            graphQLErrors[0].message,
          );
        }
      } else if (networkError) {
        let message = `Network connection failed: ${networkError.message}`;
        finalErrorToPropagate = new NetworkOperationError(
          message,
          networkError,
        );
      }

      if (finalErrorToPropagate) {
        return new Observable((observer) => {
          observer.error(finalErrorToPropagate);
        });
      }

      return forward(operation);
    },
  );

  const httpLink = new HttpLink({
    uri: "http://localhost:3001/graphql",
  });

  const link = ApolloLink.from([errorLink, httpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
});
