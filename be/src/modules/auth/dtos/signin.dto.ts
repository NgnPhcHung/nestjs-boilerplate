import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInDto {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
