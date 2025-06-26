export interface UserMovePosition {
  x: number;
  y: number;
}

export interface UserPlayground {
  userId: number;
  position: UserMovePosition;
  avatarImg: string;
}
