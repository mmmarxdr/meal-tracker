import {
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../ports/password-hasher.interface';
import { Email } from '../../../domain/value-objects/email.vo';
import { HashedPassword } from '../../../domain/value-objects/hashed-password.vo';
import { User } from '../../../domain/entities/user.entity';
import { RegisterUserDto, RegisterUserResponseDto } from './register-user.dto';
import { IEmailSender } from '../../ports/email-sender.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(IEmailSender)
    private readonly emailSender: IEmailSender,
  ) {}

  async execute(dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
    let email: Email;
    try {
      email = Email.create(dto.email);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const userExists = await this.userRepository.existsByEmail(email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordValidation = HashedPassword.fromPlainPassword(dto.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.error);
    }

    const hashedPasswordString = await this.passwordHasher.hash(dto.password);
    const hashedPassword = HashedPassword.create(hashedPasswordString);

    const user = User.create(email, hashedPassword);

    const savedUser = await this.userRepository.save(user);

    try {
      await this.emailSender.sendVerificationEmail(
        savedUser.getEmail().getValue(),
        savedUser.getVerificationToken()!,
      );
    } catch (error) {
      console.error('Failed to send verification email', error);
    }

    return {
      userId: savedUser.getId(),
      email: savedUser.getEmail().getValue(),
      createdAt: savedUser.getCreatedAt(),
      emailVerified: savedUser.isEmailVerified(),
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }
}
