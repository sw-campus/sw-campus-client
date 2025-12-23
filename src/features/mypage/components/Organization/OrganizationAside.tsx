'use client'

type OrganizationAsideProps = {
  active: 'orgInfo' | 'lectureManage'
  onClickOrgInfo: () => void
  onClickLectureManage: () => void
}

export default function OrganizationAside({ active, onClickOrgInfo, onClickLectureManage }: OrganizationAsideProps) {
  const orgInfoClass =
    active === 'orgInfo'
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  const lectureManageClass =
    active === 'lectureManage'
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  return (
    <>
      {/* Mobile/Tablet Top Tabs */}
      <div className="lg:hidden w-full">
        <nav className="flex w-full items-center gap-2">
          <button
            onClick={onClickOrgInfo}
            aria-current={active === 'orgInfo' ? 'page' : undefined}
            className={
              active === 'orgInfo'
                ? 'flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium'
                : 'flex-1 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100'
            }
          >
            기업정보 관리
          </button>
          <button
            onClick={onClickLectureManage}
            aria-current={active === 'lectureManage' ? 'page' : undefined}
            className={
              active === 'lectureManage'
                ? 'flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium'
                : 'flex-1 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100'
            }
          >
            강의 관리
          </button>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10 lg:block">
        <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>

        <nav className="space-y-2 text-sm leading-relaxed">
          <button onClick={onClickOrgInfo} className={orgInfoClass} aria-current={active === 'orgInfo' ? 'page' : undefined}>
            기업정보 관리
          </button>

          <button
            onClick={onClickLectureManage}
            className={lectureManageClass}
            aria-current={active === 'lectureManage' ? 'page' : undefined}
          >
            강의 관리
          </button>
        </nav>
      </aside>
    </>
  )
}
