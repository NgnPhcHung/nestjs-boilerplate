import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

ObjectType();
export class AuthModel {
  @Field()
  token: string;

  @Field()
  user: UserModel;
}
