import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AdminShell } from '@/components/admin-shell';
import { useAuthStore } from '@/stores/auth-store';
import { AdminRole } from '@/shared/types';
import { HomePage } from '@/pages/home-page';
import { AuditPage } from '@/pages/audit-page';
import { LeadDetailPage } from '@/pages/lead-detail-page';
import { LeadsPage } from '@/pages/leads-page';
import { LoginPage } from '@/pages/login-page';
import { ComplianceCasePage, ComplianceQueuePage } from '@/pages/compliance-pages';
import { QaUploadPage } from '@/pages/qa-upload-page';
import { AccountPage } from '@/pages/account-page';
import { SenderRegisterPage } from '@/pages/sender-register-page';
import { SenderOnboardingPage } from '@/pages/sender-onboarding-page';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function SuperOnly({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.role);
  if (role !== AdminRole.SUPER_ADMIN) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function OpsOnly({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.role);
  const ok =
    role === AdminRole.SUPER_ADMIN ||
    role === AdminRole.STATE_MASTER ||
    role === AdminRole.LOCAL_BDE;
  if (!ok) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ProtectedShell() {
  return (
    <ProtectedRoute>
      <AdminShell />
    </ProtectedRoute>
  );
}

function ComplianceCaseRoute() {
  const { id } = useParams();
  if (!id) return <Navigate to="/compliance" replace />;
  return <ComplianceCasePage caseId={id} />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/sender" element={<SenderRegisterPage />} />
      <Route element={<ProtectedShell />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/leads"
          element={
            <SuperOnly>
              <LeadsPage />
            </SuperOnly>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <SuperOnly>
              <LeadDetailPage />
            </SuperOnly>
          }
        />
        <Route
          path="/audit"
          element={
            <SuperOnly>
              <AuditPage />
            </SuperOnly>
          }
        />
        <Route
          path="/compliance"
          element={
            <OpsOnly>
              <ComplianceQueuePage />
            </OpsOnly>
          }
        />
        <Route
          path="/compliance/:id"
          element={
            <OpsOnly>
              <ComplianceCaseRoute />
            </OpsOnly>
          }
        />
        <Route path="/sender/onboarding" element={<SenderOnboardingPage />} />
        <Route path="/qa/upload" element={<QaUploadPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
