// apps/auth-service/src/infrastructure/auth/passport/strategies/local.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserUseCase } from '../../../../application/use-cases/validate-user/validate-user.use-case';
import { ValidatedUserDto } from '../../../../application/use-cases/validate-user/validate-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({
      // Por defecto Passport espera 'username' y 'password'
      // Cambiamos 'username' a 'email' para nuestro caso
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Este método es llamado automáticamente por Passport después de extraer
   * las credenciales del request.
   *
   * @param email - Extraído del campo 'email' del body
   * @param password - Extraído del campo 'password' del body
   * @returns ValidatedUserDto - Se adjunta a request.user
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async validate(email: string, password: string): Promise<ValidatedUserDto> {
    const user = await this.validateUserUseCase.execute({ email, password });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
