'use client'

import { Button } from '@/components/ui/button'

type OrganizationMainProps = {
  isOrgPasswordOpen: boolean
  openInfoModal: () => void
  onOpenProductModal: () => void
}

const dashboardStats = [
  { label: '등록 대기', value: '1개', note: '내부 승인 대기중' },
  { label: '반려된 교육과정', value: '2개', note: '이번 분기 시작 예정' },
  { label: '승인된 교육과정', value: '5개', note: '평균 수강률 86%' },
]

export default function OrganizationMain({
  isOrgPasswordOpen,
  openInfoModal,
  onOpenProductModal,
}: OrganizationMainProps) {
  if (isOrgPasswordOpen) {
    return (
      <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
        <header>
          <h3 className="text-2xl font-semibold text-white">비밀번호 확인</h3>
          <p className="mt-1 text-sm text-white/70">기업 정보 수정을 위해 비밀번호를 입력해주세요.</p>
        </header>

        <div className="max-w-sm">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none"
          />
          <Button className="mt-4 w-full" onClick={openInfoModal}>
            확인
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">조직 전용 교육과정 공간</p>
          <h3 className="text-2xl font-semibold text-white">교육과정 관리</h3>
        </div>
        <Button onClick={onOpenProductModal}>교육과정 등록</Button>
      </header>

      <section className="rounded-2xl bg-white/10 p-5 text-white/80">
        <div className="grid gap-4 sm:grid-cols-3">
          {dashboardStats.map(stat => (
            <article key={stat.label} className="rounded-xl bg-white/5 p-4">
              <p className="text-xs text-white/60 uppercase">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-white/60">{stat.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
