import { gql } from "@apollo/client";

export const LIST_PLAYER = gql`
  query players {
    players {
      userId
      position {
        x
        y
      }
      avatarImg
    }
  }
`;
