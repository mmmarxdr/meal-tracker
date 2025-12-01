import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}

export const IUserRepository = Symbol('IUserRepository');
