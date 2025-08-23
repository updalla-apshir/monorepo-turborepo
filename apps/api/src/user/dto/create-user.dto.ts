import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'please provide a valid email' })
  email: string;

  @IsString()
  name: string;
  @IsString()
  password: string;
}
