import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  @Get('_status')
  @ApiOperation({ summary: 'Jobs module scaffold (M0)' })
  status() {
    return { module: 'jobs', status: 'ready', milestone: 'M0' };
  }
}
