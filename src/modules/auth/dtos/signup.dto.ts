import { UserRole } from '@consts';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, MinLength } from 'class-validator';

@InputType()
export class SignUpDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  name: string;

  @IsEnum(UserRole)
  @Field()
  role: string;
}
