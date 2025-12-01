import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'apps/auth-service/src/domain/repositories/user.repository.interface';
import { IEmailSender } from '../../ports/email-sender.interface';
import {
  ResendVerificationDto,
  ResendVerificationResponseDto,
} from './resend-verification.dto';
import { Email } from 'apps/auth-service/src/domain/value-objects/email.vo';

@Injectable()
export class ResendVerificationEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IEmailSender)
    private readonly emailSender: IEmailSender,
  ) {}

  async execute(
    dto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    let email: Email;

    try {
      email = Email.create(dto.email);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified()) {
      throw new BadRequestException('Email is already verified');
    }

    user.regenerateVerificationToken();
    const savedUser = await this.userRepository.save(user);

    try {
      await this.emailSender.sendVerificationEmail(
        savedUser.getEmail().getValue(),
        savedUser.getVerificationToken()!,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new BadRequestException('Failed to send verification email');
    }

    return {
      message: 'Verification email sent successfully. Please check your inbox.',
    };
  }
}
