import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuditModule } from '../audit/audit.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [JwtModule.register({}), AuditModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, JwtAuthGuard],
  exports: [DocumentsService],
})
export class DocumentsModule implements OnModuleInit {
  constructor(private readonly documentsService: DocumentsService) {}

  onModuleInit() {
    this.documentsService.ensureStorageDir();
  }
}
