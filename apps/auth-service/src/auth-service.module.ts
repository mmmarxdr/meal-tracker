import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { SecurityModule } from './infrastructure/security/security.module';
import { RegisterUserUseCase } from './application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user/login-user.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { EmailModule } from './infrastructure/email/email.module';
import { VerifyEmailUseCase } from './application/use-cases/verify-email/verify-email.use-case';
import { ResendVerificationEmailUseCase } from './application/use-cases/resend-verification/resend-verification.use-case';
import { PassportModule } from '@nestjs/passport';
import { ValidateUserUseCase } from './application/use-cases/validate-user/validate-user.use-case';
import { ValidateTokenUseCase } from './application/use-cases/validate-token/validate-token.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    PersistenceModule,
    SecurityModule,
    EmailModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    VerifyEmailUseCase,
    ResendVerificationEmailUseCase,
    ValidateUserUseCase,
    ValidateTokenUseCase,
  ],
})
export class AuthServiceModule {}
