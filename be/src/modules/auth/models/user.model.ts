import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'generated/prisma';

@ObjectType()
export class UserModel {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  role: UserRole;
}
