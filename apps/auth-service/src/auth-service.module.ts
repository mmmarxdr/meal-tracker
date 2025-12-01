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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    PersistenceModule,
    SecurityModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    VerifyEmailUseCase,
    ResendVerificationEmailUseCase,
  ],
})
export class AuthServiceModule {}
