import {
  GraphQLExtensions,
  GraphqlCustomError,
  NetworkOperationError,
} from "@/types/graphql";
import { Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export const graphQLError = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    let finalErrorToPropagate: Error | null = null;
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        const extensions = err.extensions as GraphQLExtensions | undefined;
        const outerExceptionWrapper = extensions?.exception;
        const innerServerExceptionDetails = outerExceptionWrapper?.exception;

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
      let message = networkError.message;
      finalErrorToPropagate = new NetworkOperationError(message, networkError);
    }

    if (finalErrorToPropagate) {
      return new Observable((observer) => {
        observer.error(finalErrorToPropagate);
      });
    }

    return forward(operation);
  },
);
