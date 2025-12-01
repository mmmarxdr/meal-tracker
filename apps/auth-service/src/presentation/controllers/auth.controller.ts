import { Controller, ValidationPipe, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email/verify-email.use-case';
import { ResendVerificationEmailUseCase } from '../../application/use-cases/resend-verification/resend-verification.use-case';
import { AUTH_PATTERNS } from '@app/common/constants/auth.patterns';
import { VerifyEmailRequestDto } from '../dto/verify-email-request.dto';
import { ResendVerificationRequestDto } from '../dto/resend-verification-request.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationEmailUseCase: ResendVerificationEmailUseCase,
  ) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Payload() dto: RegisterRequestDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Payload() dto: LoginRequestDto) {
    return this.loginUserUseCase.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_EMAIL)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyEmail(@Payload() dto: VerifyEmailRequestDto) {
    return this.verifyEmailUseCase.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.RESEND_VERIFICATION_EMAIL)
  async resendVerificationEmail(@Payload() dto: ResendVerificationRequestDto) {
    return this.resendVerificationEmailUseCase.execute(dto);
  }

  @MessagePattern(AUTH_PATTERNS.HEALTH)
  async health() {
    return Promise.resolve({ status: 'ok', service: 'auth-service' });
  }
}
