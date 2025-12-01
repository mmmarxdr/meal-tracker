export class RegisterUserDto {
  email: string;
  password: string;
}

export class RegisterUserResponseDto {
  userId: string;
  email: string;
  createdAt: Date;
  emailVerified: boolean;
  message: string;
}
