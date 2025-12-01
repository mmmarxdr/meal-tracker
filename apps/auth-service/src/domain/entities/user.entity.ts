import { Email } from '../value-objects/email.vo';
import { HashedPassword } from '../value-objects/hashed-password.vo';

export class User {
  private readonly id: string;
  private readonly email: Email;
  private readonly password: HashedPassword;
  private emailVerified: boolean;
  private verificationToken: string | null;
  private verificationTokenExpiry: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor({
    id,
    email,
    password,
    emailVerified,
    verificationToken,
    verificationTokenExpiry,
    createdAt,
    updatedAt,
  }: {
    id: string;
    email: Email;
    password: HashedPassword;
    emailVerified: boolean;
    verificationToken: string | null;
    verificationTokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.emailVerified = emailVerified;
    this.verificationToken = verificationToken;
    this.verificationTokenExpiry = verificationTokenExpiry;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(email: Email, password: HashedPassword): User {
    const now = new Date();
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiry = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    return new User({
      id: crypto.randomUUID(),
      email,
      password,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute({
    id,
    email,
    password,
    emailVerified,
    verificationToken,
    verificationTokenExpiry,
    createdAt,
    updatedAt,
  }: {
    id: string;
    email: Email;
    password: HashedPassword;
    emailVerified: boolean;
    verificationToken: string | null;
    verificationTokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id,
      email,
      password,
      emailVerified,
      verificationToken,
      verificationTokenExpiry,
      createdAt,
      updatedAt,
    });
  }

  getId(): string {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): HashedPassword {
    return this.password;
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  getVerificationToken(): string | null {
    return this.verificationToken;
  }

  getVerificationTokenExpiry(): Date | null {
    return this.verificationTokenExpiry;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    if (this.emailVerified) {
      throw new Error('Email is already verified');
    }

    if (!this.verificationToken) {
      throw new Error('No verification token found');
    }

    if (
      !this.verificationTokenExpiry ||
      this.verificationTokenExpiry < new Date()
    ) {
      throw new Error('Verification token has expired');
    }

    this.emailVerified = true;
    this.verificationToken = null;
    this.verificationTokenExpiry = null;
    this.updateTimestamp();
  }

  regenerateVerificationToken(): void {
    if (this.emailVerified) {
      throw new Error('Email already verified');
    }

    this.verificationToken = crypto.randomUUID();
    this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.updateTimestamp();
  }
}
