// libs/common/src/constants/auth.patterns.ts

export const AUTH_PATTERNS = {
  // Existing patterns
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  VERIFY_EMAIL: 'auth.verify-email',
  RESEND_VERIFICATION_EMAIL: 'auth.resend-verification-email',
  HEALTH: 'auth.health',

  // New patterns for Passport integration
  VALIDATE_TOKEN: 'auth.validate-token',

  // Future patterns (Phase 2)
  REFRESH_TOKEN: 'auth.refresh-token',
  LOGOUT: 'auth.logout',
  REVOKE_ALL_TOKENS: 'auth.revoke-all-tokens',

  // Future patterns (Phase 4)
  FORGOT_PASSWORD: 'auth.forgot-password',
  RESET_PASSWORD: 'auth.reset-password',

  // Future patterns (Phase 5 - OAuth)
  GOOGLE_LOGIN: 'auth.google-login',
  GOOGLE_CALLBACK: 'auth.google-callback',
} as const;

export type AuthPattern = (typeof AUTH_PATTERNS)[keyof typeof AUTH_PATTERNS];
