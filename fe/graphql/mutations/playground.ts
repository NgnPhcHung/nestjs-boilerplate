import { gql } from "@apollo/client";

const PLAYER_FIELDS = gql`
  fragment PlayerFields on Player {
    userId
    avatarImg
    position {
      x
      y
    }
  }
`;

export const USER_JOIN_MUTATION = gql`
  mutation UserJoinPlayground($userId: Int!) {
    userJoinPlayground(userId: $userId) {
      ...PlayerFields
    }
  }
  ${PLAYER_FIELDS}
`;

export const UPDATE_PLAYER_POSITION_MUTATION = gql`
  mutation UpdatePlayerPosition($userId: Int!, $x: Float!, $y: Float!) {
    updatePlayerPosition(userId: $userId, x: $x, y: $y) {
      ...PlayerFields
    }
  }
  ${PLAYER_FIELDS}
`;
