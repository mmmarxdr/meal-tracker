import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
