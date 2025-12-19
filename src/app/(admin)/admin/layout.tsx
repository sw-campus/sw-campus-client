import HeaderSection from '@/components/layout/header/HeaderSection'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
    </>
  )
}
