import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { AppRole } from '../../shared/types';
import type { AuthenticatedPrincipal } from './jwt-auth.guard';

function mockContext(user?: AuthenticatedPrincipal) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as never;
}

describe('RolesGuard', () => {
  it('allows when no roles metadata', () => {
    const reflector = {
      getAllAndOverride: () => undefined,
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('denies State Master on Super-only route', () => {
    const reflector = {
      getAllAndOverride: () => [AppRole.SUPER_ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const principal: AuthenticatedPrincipal = {
      id: '1',
      email: 'state@test.com',
      role: AppRole.STATE_MASTER,
      kind: 'admin',
      regionCodes: ['VIC'],
      territoryCodes: [],
    };
    expect(() => guard.canActivate(mockContext(principal))).toThrow(ForbiddenException);
  });

  it('denies Local BDE on Super policy route', () => {
    const reflector = {
      getAllAndOverride: () => [AppRole.SUPER_ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const principal: AuthenticatedPrincipal = {
      id: '2',
      email: 'local@test.com',
      role: AppRole.LOCAL_BDE,
      kind: 'admin',
      regionCodes: ['VIC'],
      territoryCodes: ['MEL'],
    };
    expect(() => guard.canActivate(mockContext(principal))).toThrow(ForbiddenException);
  });

  it('denies Sender on admin route', () => {
    const reflector = {
      getAllAndOverride: () => [AppRole.SUPER_ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const principal: AuthenticatedPrincipal = {
      id: '3',
      email: 'sender@test.com',
      role: AppRole.SENDER,
      kind: 'user',
      regionCodes: [],
      territoryCodes: [],
    };
    expect(() => guard.canActivate(mockContext(principal))).toThrow(ForbiddenException);
  });

  it('allows matching role', () => {
    const reflector = {
      getAllAndOverride: () => [AppRole.SUPER_ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const principal: AuthenticatedPrincipal = {
      id: '4',
      email: 'super@test.com',
      role: AppRole.SUPER_ADMIN,
      kind: 'admin',
      regionCodes: [],
      territoryCodes: [],
    };
    expect(guard.canActivate(mockContext(principal))).toBe(true);
  });
});
