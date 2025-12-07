export class ValidateUserDto {
  email: string;
  password: string;
}

export class ValidatedUserDto {
  userId: string;
  email: string;
  isEmailVerified: boolean;
}
