import { Inject, Injectable } from '@nestjs/common';
import { ITokenGenerator } from '../../ports/token-generator.interface';
import {
  ValidateTokenDto,
  ValidateTokenResponseDto,
} from './validate-token.dto';

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(ITokenGenerator)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  /**
   * Valida un JWT token y retorna su payload si es válido.
   * Usado por el API Gateway para verificar tokens en requests.
   *
   * En Fase 2, también verificará si el token está en blacklist.
   */
  async execute(dto: ValidateTokenDto): Promise<ValidateTokenResponseDto> {
    try {
      const payload = await this.tokenGenerator.verify(dto.token);

      if (!payload) {
        return {
          valid: false,
          payload: null,
          error: 'Invalid or expired token',
        };
      }

      // TODO (Phase 2): Check if token is blacklisted
      // const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(dto.token);
      // if (isBlacklisted) {
      //   return { valid: false, payload: null, error: 'Token has been revoked' };
      // }

      return {
        valid: true,
        payload: {
          userId: payload.userId,
          email: payload.email,
        },
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        valid: false,
        payload: null,
        error: 'Token verification failed',
      };
    }
  }
}
