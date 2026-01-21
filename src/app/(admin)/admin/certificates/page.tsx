import { AdminSidebar, CertificateApprovalPage } from '@/features/admin'

export default function AdminCertificatesPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex flex-col gap-4 lg:flex-row lg:gap-6">
          <AdminSidebar />
          <CertificateApprovalPage />
        </div>
      </div>
    </>
  )
}
