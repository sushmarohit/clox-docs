import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('settlements')
@Controller('settlements')
export class SettlementsController {
  @Get('_status')
  @ApiOperation({ summary: 'Settlements module scaffold (M0)' })
  status() {
    return { module: 'settlements', status: 'ready', milestone: 'M0' };
  }
}
