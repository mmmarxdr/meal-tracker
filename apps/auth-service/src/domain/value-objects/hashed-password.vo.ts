export class HashedPassword {
  private readonly value: string;

  private constructor(hashedPassword: string) {
    this.value = hashedPassword;
  }

  static create(hashedPassword: string): HashedPassword {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new Error('Hashed password cannot be empty');
    }

    return new HashedPassword(hashedPassword);
  }

  static fromPlainPassword(plainPassword: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!plainPassword || plainPassword.length < 8) {
      return {
        isValid: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    if (!/[A-Z]/.test(plainPassword)) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter',
      };
    }

    if (!/[a-z]/.test(plainPassword)) {
      return {
        isValid: false,
        error: 'Password must contain at least one lowercase letter',
      };
    }

    if (!/[0-9]/.test(plainPassword)) {
      return {
        isValid: false,
        error: 'Password must contain at least one number',
      };
    }

    return { isValid: true };
  }

  getValue(): string {
    return this.value;
  }
}
