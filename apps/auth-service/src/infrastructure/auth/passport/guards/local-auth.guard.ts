import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que activa la estrategia 'local' de Passport.
 * Usa para proteger el endpoint de login.
 *
 * Extrae email/password del body y llama a LocalStrategy.validate()
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
