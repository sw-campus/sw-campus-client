import { AdminSidebar, BannerManagementPage } from '@/features/admin'

export default function AdminBannersPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <BannerManagementPage />
        </div>
      </div>
    </>
  )
}
