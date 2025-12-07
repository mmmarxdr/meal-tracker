// apps/auth-service/src/infrastructure/auth/passport/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Definimos el tipo aquí para evitar dependencias circulares
// y tener control total sobre el tipado
export interface AuthenticatedUser {
  userId: string;
  email: string;
}

interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

/**
 * Decorator para extraer el usuario actual del request.
 * Solo funciona en rutas protegidas por JwtAuthGuard.
 *
 * @example
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 *
 * // También puedes extraer un campo específico
 * @Get('profile')
 * getProfile(@CurrentUser('userId') userId: string) {
 *   return { userId };
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    // Si se especifica un campo, retornar solo ese campo
    if (data) {
      return user[data];
    }

    // Si no, retornar el usuario completo
    return user;
  },
);
