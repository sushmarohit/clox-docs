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
export {
  registerSender,
  getSenderOnboarding,
  updateSenderProfile,
  submitSenderVerification,
  setupSenderPayment,
  confirmSenderPayment,
  getBookingEligibility,
  type SenderOnboarding,
} from '@/lib/api/sender';
export {
  registerCarrier,
  getCarrierOnboarding,
  updateCarrierProfile,
  setupCarrierConnect,
  confirmCarrierConnect,
  addCarrierVehicle,
  inviteCarrierDriver,
  resendCarrierDriverInvite,
  updateCarrierCapabilities,
  submitCarrierVerification,
  getBidEligibility,
  type CarrierOnboarding,
} from '@/lib/api/carrier';
export {
  peekDriverInvite,
  acceptDriverInvite,
  getDriverOnboarding,
  submitDriverProfile,
  getDriverAssignability,
  type DriverOnboarding,
  type DriverInvitePeek,
} from '@/lib/api/driver';
