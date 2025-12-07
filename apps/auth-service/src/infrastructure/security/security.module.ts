import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';
import { JwtTokenGenerator } from './jwt-token-generator';
import { IPasswordHasher } from '../../application/ports/password-hasher.interface';
import { ITokenGenerator } from '../../application/ports/token-generator.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'your-secret-key-change-in-production',
        ),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IPasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: ITokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [IPasswordHasher, ITokenGenerator],
})
export class SecurityModule {}
