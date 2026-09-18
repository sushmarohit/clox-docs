import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { CurrentPrincipal } from '../../common/decorators/current-admin.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard, type AuthenticatedPrincipal } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AppRole } from '../../shared/types';
import { SenderService } from '../sender/sender.service';

const createJobStubSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

type CreateJobStubInput = z.infer<typeof createJobStubSchema>;

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly senderService: SenderService) {}

  @Get('_status')
  @ApiOperation({ summary: 'Jobs module status' })
  status() {
    return { module: 'jobs', status: 'ready', milestone: 'M3-gate' };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.SENDER)
  @ApiOperation({
    summary: 'Create job stub — blocked unless sender go/no-go canBook',
  })
  async createStub(
    @CurrentPrincipal() principal: AuthenticatedPrincipal,
    @Body(new ZodValidationPipe(createJobStubSchema)) _body: CreateJobStubInput,
  ) {
    const eligibility = await this.senderService.getBookingEligibility(principal);
    if (!eligibility.canBook) {
      throw new ForbiddenException({
        message: 'Sender cannot create jobs until Ops approve + invoice + payment ready',
        code: 'SENDER_NOT_BOOKING_READY',
        goNoGo: eligibility.goNoGo,
      });
    }
    return {
      success: false,
      message: 'Job create full implementation is M6 — eligibility gate passed',
      code: 'JOBS_M6_PENDING',
      eligibility,
    };
  }
}
