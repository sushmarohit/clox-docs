import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SenderModule } from '../sender/sender.module';
import { JobsController } from './jobs.controller';

@Module({
  imports: [JwtModule.register({}), SenderModule],
  controllers: [JobsController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class JobsModule {}
