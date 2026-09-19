import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppRole, carrierBidStubSchema, type CarrierBidStubInput } from '../../shared/types';
import { CurrentPrincipal } from '../../common/decorators/current-admin.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard, type AuthenticatedPrincipal } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CarrierService } from '../carrier/carrier.service';

@ApiTags('matching')
@Controller('matching')
export class MatchingController {
  constructor(private readonly carrierService: CarrierService) {}

  @Get('_status')
  @ApiOperation({ summary: 'Matching module status' })
  status() {
    return { module: 'matching', status: 'ready', milestone: 'M4-gate' };
  }

  @Post('bids')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.TRANSPORT_COMPANY)
  @ApiOperation({ summary: 'Place bid stub — 403 unless carrier canBid (M4 gate)' })
  placeBid(
    @CurrentPrincipal() principal: AuthenticatedPrincipal,
    @Body(new ZodValidationPipe(carrierBidStubSchema)) body: CarrierBidStubInput,
  ) {
    return this.carrierService.createBidStub(principal, body);
  }
}
