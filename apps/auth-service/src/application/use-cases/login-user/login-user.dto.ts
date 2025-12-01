export class LoginUserDto {
  email: string;
  password: string;
}

export class LoginUserResponseDto {
  accessToken: string;
  userId: string;
  email: string;
}
