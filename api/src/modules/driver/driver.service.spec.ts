import { ForbiddenException } from '@nestjs/common';
import { DriverStatus } from '@prisma/client';
import { DriverService } from './driver.service';

describe('DriverService assignability', () => {
  it('orphan driver cannot be assigned', async () => {
    const prisma = {
      isConnected: () => true,
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'u1',
          email: 'd@test.com',
          role: 'DRIVER',
          name: 'D',
          phone: null,
          driver: {
            id: 'dr1',
            status: DriverStatus.ACTIVE,
            companyId: null,
            company: null,
            licenceNo: 'X',
            licenceClass: 'C',
            licenceExpiry: new Date(Date.now() + 86_400_000),
            nhvrAcknowledgedAt: new Date(),
            inviteAcceptedAt: new Date(),
          },
        }),
      },
    };
    const service = new DriverService(
      prisma as never,
      { recordPlatform: jest.fn() } as never,
      { sendDriverInviteEmail: jest.fn() } as never,
      {
        get: (k: string) => (k === 'DRIVER_INVITE_TTL_HOURS' ? 168 : 'http://localhost:5174'),
      } as never,
    );
    const result = await service.getAssignability({
      id: 'u1',
      email: 'd@test.com',
      role: 'DRIVER',
      kind: 'user',
      regionCodes: [],
      territoryCodes: [],
    });
    expect(result.canBeAssigned).toBe(false);
    expect(result.reason).toBe('ORPHAN_DRIVER');
  });

  it('rejects non-driver principal', async () => {
    const service = new DriverService(
      { isConnected: () => true } as never,
      { recordPlatform: jest.fn() } as never,
      { sendDriverInviteEmail: jest.fn() } as never,
      { get: () => 168 } as never,
    );
    await expect(
      service.getOnboarding({
        id: 'u1',
        email: 'c@test.com',
        role: 'TRANSPORT_COMPANY',
        kind: 'user',
        regionCodes: [],
        territoryCodes: [],
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
