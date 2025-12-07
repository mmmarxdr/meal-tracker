// apps/auth-service/src/infrastructure/auth/passport/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Payload que viene dentro del JWT
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number; // Issued at (agregado automáticamente)
  exp?: number; // Expiration (agregado automáticamente)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extraer el JWT del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No ignorar expiración - tokens expirados serán rechazados
      ignoreExpiration: false,

      // Secret para verificar la firma del token
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'your-secret-key-change-in-production',
      ),
    });
  }

  /**
   * Este método es llamado DESPUÉS de que Passport verifica:
   * 1. La firma del JWT es válida
   * 2. El token no ha expirado
   *
   * El payload ya está decodificado cuando llega aquí.
   *
   * @param payload - El contenido decodificado del JWT
   * @returns El objeto que se adjuntará a request.user
   */
  validate(payload: JwtPayload): JwtPayload {
    // Aquí podrías agregar validaciones adicionales:
    // - Verificar si el token está en blacklist (Fase 2)
    // - Verificar si el usuario aún existe en la DB
    // - Verificar si el usuario no está deshabilitado

    if (!payload.userId || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Retornamos el payload que se adjuntará a request.user
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }
}
