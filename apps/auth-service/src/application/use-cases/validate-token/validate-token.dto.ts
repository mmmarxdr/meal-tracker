export interface ValidateTokenDto {
  token: string;
}

export interface ValidateTokenResponseDto {
  valid: boolean;
  payload: {
    userId: string;
    email: string;
  } | null;
  error?: string;
}
