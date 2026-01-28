import { AdminSidebar, BannerManagementPage } from '@/features/admin'

export default function AdminBannersPage() {
  return (
    <div className="page-container custom-container">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <AdminSidebar />
        <BannerManagementPage />
      </div>
    </div>
  )
}
