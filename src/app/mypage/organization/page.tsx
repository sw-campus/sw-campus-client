'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const dashboardStats = [
  { label: '등록 대기', value: '1개', note: '내부 승인 대기중' },
  { label: '반려된 교육과정', value: '2개', note: '이번 분기 시작 예정' },
  { label: '승인된 교육과정', value: '5개', note: '평균 수강률 86%' },
]

export default function MyPage() {
  const router = useRouter()
  const openProductModal = () => {
    router.push('/mypage/organization/lectures/new')
  }

  return (
    <div className="custom-container">
      <div className="custom-card">
        <div className="relative z-10 flex w-full gap-6">
          <aside className="w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10">
            <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>
            <nav className="space-y-2 text-sm leading-relaxed">
              <button className="block w-full rounded-lg px-3 py-2 text-left font-medium text-neutral-900 transition hover:bg-neutral-100">
                기업정보 관리
              </button>
              <button className="block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100">
                강의 관리
              </button>
            </nav>
          </aside>

          <main className="flex flex-1 flex-col gap-6 rounded-3xl bg-neutral-600/80 p-6 shadow-black/40">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/80">조직 전용 교육과정 공간</p>
                <h3 className="text-2xl font-semibold text-white">교육과정 관리</h3>
              </div>
              <Button onClick={() => openProductModal()}>교육과정 등록</Button>
            </header>

            <section className="rounded-2xl bg-white/10 p-5 text-white/80 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]">
              <div className="grid gap-4 sm:grid-cols-3">
                {dashboardStats.map(stat => (
                  <article key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
                    <p className="text-xs font-medium tracking-wide text-white/70 uppercase">{stat.label}</p>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/60">{stat.note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
              <p>
                교육과정 목록이 아직 등록되지 않았습니다. 상단의 버튼을 눌러 새로운 교육과정을 생성하고, 필요한 데이터를
                채워주세요.
              </p>
              <p className="mt-2 text-xs text-white/50">
                등록된 교육과정은 내부 검토 후 공개되며, 작성한 강의 자료와 일정은 언제든지 수정할 수 있습니다.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
