// apps/auth-service/src/presentation/controllers/auth.controller.ts

import { Controller, ValidationPipe, UsePipes, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Use Cases
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email/verify-email.use-case';
import { ResendVerificationEmailUseCase } from '../../application/use-cases/resend-verification/resend-verification.use-case';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user/validate-user.use-case';
import { ValidateTokenUseCase } from '../../application/use-cases/validate-token/validate-token.use-case';

// DTOs
import { RegisterRequestDto } from '../dto/register-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { VerifyEmailRequestDto } from '../dto/verify-email-request.dto';
import { ResendVerificationRequestDto } from '../dto/resend-verification-request.dto';

import { AUTH_PATTERNS } from '@app/common/constants/auth.patterns';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationEmailUseCase: ResendVerificationEmailUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Payload() dto: RegisterRequestDto) {
    try {
      this.logger.log(`Register request received: ${JSON.stringify(dto)}`);
      const result = await this.registerUserUseCase.execute(dto);
      this.logger.log(`Register success: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Register failed: ${JSON.stringify(error)}`);
      this.logger.error(error);
      throw error;
    }
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Payload() dto: LoginRequestDto) {
    // Paso 1: Validar usuario (lo que haría LocalStrategy)
    const validatedUser = await this.validateUserUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    if (!validatedUser) {
      // Lanzamos error que será capturado por el API Gateway
      throw new Error('Invalid credentials');
    }

    // Paso 2: Generar tokens
    return this.loginUserUseCase.execute(validatedUser);
  }

  /**
   * Nuevo endpoint para validar tokens JWT.
   * El API Gateway llamará a este endpoint para verificar tokens.
   */
  @MessagePattern(AUTH_PATTERNS.VALIDATE_TOKEN)
  async validateToken(@Payload() payload: { token: string }) {
    return this.validateTokenUseCase.execute(payload);
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
