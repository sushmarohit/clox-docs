import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('geolocation')
@Controller('geolocation')
export class GeolocationController {
  @Get('_status')
  @ApiOperation({ summary: 'Geolocation module scaffold (M0) — Valhalla + PostGIS' })
  status() {
    return { module: 'geolocation', status: 'ready', milestone: 'M0' };
  }
}
