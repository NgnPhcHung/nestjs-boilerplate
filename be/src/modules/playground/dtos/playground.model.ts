import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Position {
  @Field(() => Float)
  x: number;

  @Field(() => Float)
  y: number;
}

@ObjectType()
export class Player {
  @Field(() => Int)
  userId: number;

  @Field(() => Position)
  position: Position;

  @Field()
  avatarImg: string;
}
