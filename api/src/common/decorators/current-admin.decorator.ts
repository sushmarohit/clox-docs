import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedPrincipal } from '../guards/jwt-auth.guard';

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedPrincipal => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedPrincipal }>();
    return request.user;
  },
);

/** @deprecated Use CurrentPrincipal */
export const CurrentAdmin = CurrentPrincipal;
