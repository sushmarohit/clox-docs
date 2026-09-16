import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('matching')
@Controller('matching')
export class MatchingController {
  @Get('_status')
  @ApiOperation({ summary: 'Matching module scaffold (M0)' })
  status() {
    return { module: 'matching', status: 'ready', milestone: 'M0' };
  }
}
