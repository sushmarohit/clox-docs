import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  @Get('_status')
  @ApiOperation({ summary: 'Trips module scaffold (M0)' })
  status() {
    return { module: 'trips', status: 'ready', milestone: 'M0' };
  }
}
