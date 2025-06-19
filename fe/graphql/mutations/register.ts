import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $username: String) {
    register(email: $email, password: $password, username: $username) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;
