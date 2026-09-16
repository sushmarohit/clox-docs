import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  @Get('_status')
  @ApiOperation({ summary: 'Payments module scaffold (M0)' })
  status() {
    return { module: 'payments', status: 'ready', milestone: 'M0' };
  }
}
