// apps/auth-service/src/application/use-cases/validate-user/validate-user.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { Email } from '../../../domain/value-objects/email.vo';
import { ValidateUserDto, ValidatedUserDto } from './validate-user.dto';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  /**
   * Validates user credentials without generating tokens.
   * Used by Passport LocalStrategy.
   * @returns ValidatedUserDto if credentials are valid, null otherwise
   */
  async execute(dto: ValidateUserDto): Promise<ValidatedUserDto | null> {
    // Validate email format
    let email: Email;
    try {
      email = Email.create(dto.email);
    } catch {
      return null;
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.isEmailVerified()) {
      return null;
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.getPassword().getValue(),
    );

    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user.getId(),
      email: user.getEmail().getValue(),
      isEmailVerified: user.isEmailVerified(),
    };
  }
}
