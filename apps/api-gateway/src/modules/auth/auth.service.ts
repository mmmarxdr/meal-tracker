import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { firstValueFrom } from 'rxjs';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { AUTH_PATTERNS } from '@app/common/constants/auth.patterns';
import { VerifyEmailDto, VerifyEmailResponseDto } from './dto/verify-email.dto';
import {
  ResendVerificationDto,
  ResendVerificationResponseDto,
} from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      this.logger.log(`Sending register request: ${JSON.stringify(dto)}`);
      const result = await firstValueFrom(
        this.authClient.send<RegisterResponseDto>(AUTH_PATTERNS.REGISTER, dto),
      );
      this.logger.log(`Register response: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Register error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    return firstValueFrom(
      this.authClient.send<LoginResponseDto>(AUTH_PATTERNS.LOGIN, dto),
    );
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<VerifyEmailResponseDto> {
    return firstValueFrom(
      this.authClient.send<VerifyEmailResponseDto>(
        AUTH_PATTERNS.VERIFY_EMAIL,
        dto,
      ),
    );
  }

  async resendVerificationEmail(
    dto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    return firstValueFrom(
      this.authClient.send<ResendVerificationResponseDto>(
        AUTH_PATTERNS.RESEND_VERIFICATION_EMAIL,
        dto,
      ),
    );
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return firstValueFrom(
      this.authClient.send<{ status: string; service: string }>(
        AUTH_PATTERNS.HEALTH,
        {},
      ),
    );
  }
}
