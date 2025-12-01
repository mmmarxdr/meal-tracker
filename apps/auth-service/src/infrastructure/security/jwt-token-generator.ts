import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../../application/ports/token-generator.interface';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: { userId: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(
    token: string,
  ): Promise<{ userId: string; email: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        userId: string;
        email: string;
      }>(token);

      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      console.error('Token verification failed', error);
      return null;
    }
  }
}
