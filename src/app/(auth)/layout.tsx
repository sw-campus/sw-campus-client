'use client'

type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl flex-col px-6 pt-6 pb-12">
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
      {children}
    </main>
  )
}
