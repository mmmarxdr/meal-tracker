import { Inject, Injectable } from '@nestjs/common';
import { ITokenGenerator } from '../../ports/token-generator.interface';
import { ValidatedUserDto } from '../validate-user/validate-user.dto';
import { LoginResponseDto } from 'apps/api-gateway/src/modules/auth/dto/login.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(ITokenGenerator)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  /**
   * Genera tokens para un usuario ya validado.
   * La validación de credenciales ahora la hace Passport (LocalStrategy).
   *
   * @param validatedUser - Usuario ya validado por Passport
   * @returns Tokens de acceso
   */
  async execute(validatedUser: ValidatedUserDto): Promise<LoginResponseDto> {
    const accessToken = await this.tokenGenerator.generate({
      userId: validatedUser.userId,
      email: validatedUser.email,
    });

    return {
      accessToken,
      userId: validatedUser.userId,
      email: validatedUser.email,
    };
  }
}
