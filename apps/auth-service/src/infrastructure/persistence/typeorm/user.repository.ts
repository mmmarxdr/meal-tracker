import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { HashedPassword } from '../../../domain/value-objects/hashed-password.vo';
import { UserSchema } from './user.schema';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async save(user: User): Promise<User> {
    const schema = new UserSchema();
    schema.id = user.getId();
    schema.email = user.getEmail().getValue();
    schema.password = user.getPassword().getValue();
    schema.emailVerified = user.isEmailVerified();
    schema.verificationToken = user.getVerificationToken();
    schema.verificationTokenExpiry = user.getVerificationTokenExpiry();
    schema.createdAt = user.getCreatedAt();
    schema.updatedAt = user.getUpdatedAt();

    const saved = await this.repository.save(schema);

    return User.reconstitute({
      id: saved.id,
      email: Email.create(saved.email),
      password: HashedPassword.create(saved.password),
      verificationToken: saved.verificationToken,
      verificationTokenExpiry: saved.verificationTokenExpiry,
      emailVerified: saved.emailVerified,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const schema = await this.repository.findOne({
      where: { email: email.getValue() },
    });

    if (!schema) {
      return null;
    }

    return this.toDomain(schema);
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.repository.findOne({
      where: { id },
    });

    if (!schema) {
      return null;
    }

    return this.toDomain(schema);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const schema = await this.repository.findOne({
      where: { verificationToken: token },
    });

    if (!schema) {
      return null;
    }

    return this.toDomain(schema);
  }

  toDomain(schema: UserSchema): User {
    return User.reconstitute({
      id: schema.id,
      email: Email.create(schema.email),
      password: HashedPassword.create(schema.password),
      emailVerified: schema.emailVerified,
      verificationToken: schema.verificationToken,
      verificationTokenExpiry: schema.verificationTokenExpiry,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
