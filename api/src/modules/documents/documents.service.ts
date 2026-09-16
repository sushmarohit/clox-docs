import { createHash, randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { access, mkdir, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComplianceDocStatus } from '@prisma/client';
import type { AppEnv } from '../../config/env.validation';
import type { AuthenticatedPrincipal } from '../../common/guards/jwt-auth.guard';
import {
  AuditAction,
  type ConfirmDocumentInput,
  type CreateUploadIntentInput,
} from '../../shared/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<AppEnv, true>,
    private readonly audit: AuditService,
  ) {}

  private ensureDatabase() {
    if (!this.prisma.isConnected()) {
      throw new ServiceUnavailableException('Database is unavailable');
    }
  }

  private storageRoot() {
    return resolve(this.config.get('STORAGE_LOCAL_DIR', { infer: true }));
  }

  private absolutePath(storageKey: string) {
    const root = this.storageRoot();
    const full = resolve(root, storageKey);
    if (!full.startsWith(root)) {
      throw new BadRequestException('Invalid storage key');
    }
    return full;
  }

  private async assertCompanyAccess(
    principal: AuthenticatedPrincipal,
    companyId: string,
  ) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (principal.kind === 'admin') {
      return company;
    }

    const user = await this.prisma.user.findUnique({ where: { id: principal.id } });
    if (!user || user.companyId !== companyId) {
      throw new ForbiddenException('Not a member of this company');
    }
    return company;
  }

  async createUploadIntent(
    principal: AuthenticatedPrincipal,
    input: CreateUploadIntentInput,
  ) {
    this.ensureDatabase();

    if (!ALLOWED_MIME.has(input.mimeType)) {
      throw new BadRequestException('Unsupported mime type');
    }
    if (input.sizeBytes > 10 * 1024 * 1024) {
      throw new BadRequestException('File exceeds 10MB limit');
    }

    await this.assertCompanyAccess(principal, input.companyId);

    const documentId = randomUUID();
    const ext =
      input.mimeType === 'application/pdf'
        ? 'pdf'
        : input.mimeType === 'image/png'
          ? 'png'
          : input.mimeType === 'image/webp'
            ? 'webp'
            : 'jpg';
    const storageKey = join(input.companyId, `${documentId}.${ext}`).replace(/\\/g, '/');

    const doc = await this.prisma.complianceDocument.create({
      data: {
        id: documentId,
        companyId: input.companyId,
        vehicleId: input.vehicleId,
        driverId: input.driverId,
        docType: input.docType,
        status: ComplianceDocStatus.UPLOAD_PENDING,
        storageKey,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        originalFilename: input.originalFilename,
        uploadedByUserId: principal.kind === 'user' ? principal.id : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });

    await this.audit.recordPlatform({
      action: AuditAction.DOC_UPLOAD_INTENT,
      actorAdminId: principal.kind === 'admin' ? principal.id : undefined,
      actorUserId: principal.kind === 'user' ? principal.id : undefined,
      entityType: 'ComplianceDocument',
      entityId: doc.id,
      metadata: { docType: doc.docType, mimeType: doc.mimeType },
    });

    const apiPrefix = this.config.get('API_PREFIX', { infer: true });
    return {
      id: doc.id,
      status: doc.status,
      storageKey: doc.storageKey,
      /** Multipart field name `file` — local stand-in for signed URL. */
      uploadUrl: `/${apiPrefix}/documents/${doc.id}/content`,
      uploadField: 'file',
      maxBytes: 10 * 1024 * 1024,
      allowedMimeTypes: [...ALLOWED_MIME],
    };
  }

  async putContent(
    principal: AuthenticatedPrincipal,
    documentId: string,
    file: { buffer: Buffer; mimetype: string; size: number; originalname: string } | undefined,
  ) {
    this.ensureDatabase();

    if (!file?.buffer?.length) {
      throw new BadRequestException('Missing file upload (multipart field "file")');
    }

    const doc = await this.prisma.complianceDocument.findUnique({
      where: { id: documentId },
    });
    if (!doc || !doc.companyId || !doc.storageKey) {
      throw new NotFoundException('Document not found');
    }
    if (doc.status !== ComplianceDocStatus.UPLOAD_PENDING) {
      throw new BadRequestException('Document is not awaiting upload');
    }

    await this.assertCompanyAccess(principal, doc.companyId);

    if (doc.mimeType && file.mimetype !== doc.mimeType) {
      throw new BadRequestException('Content-Type does not match upload intent');
    }
    const maxBytes = doc.sizeBytes ?? 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException('Upload exceeded declared size');
    }

    const fullPath = this.absolutePath(doc.storageKey);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.buffer);

    const contentHash = createHash('sha256').update(file.buffer).digest('hex');

    const updated = await this.prisma.complianceDocument.update({
      where: { id: doc.id },
      data: {
        status: ComplianceDocStatus.UPLOADED,
        contentHash,
        sizeBytes: file.size,
        originalFilename: file.originalname || doc.originalFilename,
      },
    });

    await this.audit.recordPlatform({
      action: AuditAction.DOC_UPLOADED,
      actorAdminId: principal.kind === 'admin' ? principal.id : undefined,
      actorUserId: principal.kind === 'user' ? principal.id : undefined,
      entityType: 'ComplianceDocument',
      entityId: updated.id,
      metadata: { contentHash, sizeBytes: file.size },
    });

    return {
      id: updated.id,
      status: updated.status,
      contentHash: updated.contentHash,
      sizeBytes: updated.sizeBytes,
    };
  }

  async confirm(
    principal: AuthenticatedPrincipal,
    documentId: string,
    input: ConfirmDocumentInput,
  ) {
    this.ensureDatabase();

    const doc = await this.prisma.complianceDocument.findUnique({
      where: { id: documentId },
    });
    if (!doc || !doc.companyId) {
      throw new NotFoundException('Document not found');
    }
    await this.assertCompanyAccess(principal, doc.companyId);

    if (
      doc.status !== ComplianceDocStatus.UPLOADED &&
      doc.status !== ComplianceDocStatus.UNDER_REVIEW
    ) {
      throw new BadRequestException('Document must be uploaded before confirm');
    }
    if (!doc.contentHash || doc.contentHash.toLowerCase() !== input.contentHash.toLowerCase()) {
      throw new BadRequestException('contentHash mismatch');
    }

    const updated = await this.prisma.complianceDocument.update({
      where: { id: doc.id },
      data: { status: ComplianceDocStatus.UPLOADED },
    });

    await this.audit.recordPlatform({
      action: AuditAction.DOC_CONFIRMED,
      actorAdminId: principal.kind === 'admin' ? principal.id : undefined,
      actorUserId: principal.kind === 'user' ? principal.id : undefined,
      entityType: 'ComplianceDocument',
      entityId: updated.id,
    });

    return {
      id: updated.id,
      status: updated.status,
      contentHash: updated.contentHash,
      mimeType: updated.mimeType,
      sizeBytes: updated.sizeBytes,
    };
  }

  async getMetadata(principal: AuthenticatedPrincipal, documentId: string) {
    this.ensureDatabase();
    const doc = await this.prisma.complianceDocument.findUnique({
      where: { id: documentId },
    });
    if (!doc || !doc.companyId) {
      throw new NotFoundException('Document not found');
    }
    await this.assertCompanyAccess(principal, doc.companyId);
    return {
      id: doc.id,
      companyId: doc.companyId,
      docType: doc.docType,
      status: doc.status,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      originalFilename: doc.originalFilename,
      contentHash: doc.contentHash,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    };
  }

  ensureStorageDir() {
    const root = this.storageRoot();
    if (!existsSync(root)) {
      mkdirSync(root, { recursive: true });
      this.logger.log(`Created local document storage at ${root}`);
    }
  }

  async openExists(storageKey: string) {
    const full = this.absolutePath(storageKey);
    await access(full);
    return full;
  }
}
