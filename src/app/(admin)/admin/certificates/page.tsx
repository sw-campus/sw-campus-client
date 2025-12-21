import { AdminSidebar, CertificateApprovalPage } from '@/features/admin'

export default function AdminCertificatesPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <CertificateApprovalPage />
        </div>
      </div>
    </>
  )
}
