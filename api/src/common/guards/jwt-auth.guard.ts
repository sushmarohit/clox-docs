import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AppEnv } from '../../config/env.validation';
import type { AppRole } from '../../shared/types';

export type PrincipalKind = 'admin' | 'user';

export type AuthenticatedPrincipal = {
  id: string;
  email: string;
  role: AppRole;
  kind: PrincipalKind;
  sessionId?: string;
  /** Region codes for admin scope (empty = Super / national). */
  regionCodes: string[];
  /** Local territory codes for Local BDE. */
  territoryCodes: string[];
};

/** @deprecated Prefer AuthenticatedPrincipal — kept for Phase 0 admin controllers. */
export type AuthenticatedAdmin = AuthenticatedPrincipal;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<AppEnv, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedPrincipal }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
        role: AppRole;
        typ: string;
        kind: PrincipalKind;
        sid?: string;
        regions?: string[];
        territories?: string[];
      }>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      });

      if (payload.typ !== 'access') {
        throw new UnauthorizedException('Invalid access token');
      }

      if (payload.kind !== 'admin' && payload.kind !== 'user') {
        throw new UnauthorizedException('Invalid access token');
      }

      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        kind: payload.kind,
        sessionId: payload.sid,
        regionCodes: payload.regions ?? [],
        territoryCodes: payload.territories ?? [],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
