import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator para marcar rutas como públicas.
 * Las rutas marcadas con @Public() no requieren autenticación JWT.
 *
 * @example
 * @Public()
 * @Get('health')
 * health() {
 *   return { status: 'ok' };
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
