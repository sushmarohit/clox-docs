import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CarrierModule } from '../carrier/carrier.module';
import { MatchingController } from './matching.controller';

@Module({
  imports: [JwtModule.register({}), CarrierModule],
  controllers: [MatchingController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class MatchingModule {}
