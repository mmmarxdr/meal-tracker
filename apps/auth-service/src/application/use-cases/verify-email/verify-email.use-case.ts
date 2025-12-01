import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from 'apps/auth-service/src/domain/repositories/user.repository.interface';
import { VerifyEmailDto, VerifyEmailResponseDto } from './verify-email.dto';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    const user = await this.userRepository.findByVerificationToken(dto.token);

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    try {
      user.verifyEmail();
    } catch (error) {
      throw new BadRequestException(error);
    }

    await this.userRepository.save(user);

    return {
      message: 'Email verified successfully. You can now log in.',
      emailVerified: user.isEmailVerified(),
    };
  }
}
