import {
  otpRequestSchema,
  otpVerifySchema,
  senderProfileSchema,
  senderRegisterSchema,
  createUploadIntentSchema,
} from './types';

describe('Zod schemas — M1/M2/M3 edge validation', () => {
  describe('OTP (M1-2, M1-13)', () => {
    it('rejects empty otp request', () => {
      const r = otpRequestSchema.safeParse({});
      expect(r.success).toBe(false);
    });

    it('accepts email-only request', () => {
      expect(otpRequestSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
    });

    it('rejects non-digit OTP code', () => {
      expect(otpVerifySchema.safeParse({ email: 'a@b.com', code: 'abc' }).success).toBe(false);
    });

    it('accepts 6-digit code', () => {
      expect(otpVerifySchema.safeParse({ email: 'a@b.com', code: '123456' }).success).toBe(true);
    });
  });

  describe('Sender register/profile (M3-2, M3-9)', () => {
    it('requires acceptedTerms true', () => {
      expect(
        senderRegisterSchema.safeParse({
          name: 'Test',
          email: 't@clox.test',
          acceptedTerms: false,
        }).success,
      ).toBe(false);
    });

    it('requires ABN for BUSINESS', () => {
      const r = senderProfileSchema.safeParse({
        accountType: 'BUSINESS',
        legalName: 'Co',
        homeRegionCode: 'VIC',
        invoiceLegalName: 'Co',
        invoiceAddressLine1: '1 St',
        invoiceSuburb: 'Melbourne',
        invoiceState: 'VIC',
        invoicePostcode: '3000',
      });
      expect(r.success).toBe(false);
    });

    it('accepts INDIVIDUAL without ABN', () => {
      const r = senderProfileSchema.safeParse({
        accountType: 'INDIVIDUAL',
        legalName: 'Person',
        homeRegionCode: 'VIC',
        invoiceLegalName: 'Person',
        invoiceAddressLine1: '1 St',
        invoiceSuburb: 'Melbourne',
        invoiceState: 'VIC',
        invoicePostcode: '3000',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('Upload intent (M2-1)', () => {
    it('rejects image/gif mime', () => {
      const r = createUploadIntentSchema.safeParse({
        companyId: '00000000-0000-4000-8000-000000000001',
        docType: 'ABN_EXTRACT',
        originalFilename: 'x.gif',
        mimeType: 'image/gif',
        sizeBytes: 100,
      });
      expect(r.success).toBe(false);
    });

    it('rejects size over 10MB', () => {
      const r = createUploadIntentSchema.safeParse({
        companyId: '00000000-0000-4000-8000-000000000001',
        docType: 'ABN_EXTRACT',
        originalFilename: 'x.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 11 * 1024 * 1024,
      });
      expect(r.success).toBe(false);
    });
  });
});
