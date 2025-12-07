import { Module } from '@nestjs/common';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ValidateUserUseCase } from '../../../application/use-cases/validate-user/validate-user.use-case';
import { PersistenceModule } from '../../persistence/persistence.module';
import { SecurityModule } from '../../security/security.module';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Module({
  imports: [
    NestPassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    PersistenceModule,
    SecurityModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    ValidateUserUseCase,
  ],
  exports: [
    NestPassportModule,
    LocalAuthGuard,
    JwtAuthGuard,
    ValidateUserUseCase,
  ],
})
export class PassportAuthModule {}
