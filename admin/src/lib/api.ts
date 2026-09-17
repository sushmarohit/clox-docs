export { ApiError, getErrorDetail, isAxiosError, toApiError } from '@/lib/http/client';
export { http } from '@/lib/http';
export {
  applyAuthTokensToStore,
  refreshSession,
  requestOtp,
  verifyOtp,
  logout,
  listSessions,
  revokeSession,
  getIdentityMe,
} from '@/lib/api/auth';
export {
  addLeadNote,
  exportLeadsCsv,
  getDashboardStats,
  getLead,
  listAudit,
  listLeads,
  updateLead,
  type AuditListItem,
  type DashboardStats,
  type Paginated,
} from '@/lib/api/admin';
export {
  listComplianceCases,
  getComplianceCase,
  decideCompliance,
  createUploadIntent,
  uploadDocumentContent,
  confirmDocument,
  submitCompliance,
  type ComplianceCaseListItem,
  type ComplianceCaseDetail,
} from '@/lib/api/compliance';
