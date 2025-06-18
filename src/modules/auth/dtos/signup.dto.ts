import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserRole } from 'generated/prisma';

@InputType()
export class SignUpDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  username: string;

  @IsEnum(UserRole)
  @Field()
  role: UserRole;
}
