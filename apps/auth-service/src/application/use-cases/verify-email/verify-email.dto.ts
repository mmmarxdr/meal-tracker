export class VerifyEmailDto {
  token: string;
}

export class VerifyEmailResponseDto {
  message: string;
  emailVerified: boolean;
}
