import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  @Get('_status')
  @ApiOperation({ summary: 'Notifications module scaffold (M0)' })
  status() {
    return { module: 'notifications', status: 'ready', milestone: 'M0' };
  }
}
