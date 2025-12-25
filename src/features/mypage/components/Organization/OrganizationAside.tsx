'use client'

type OrganizationAsideProps = {
  active: 'orgInfo' | 'lectureManage' | 'myInfo'
  onClickOrgInfo: () => void
  onClickLectureManage: () => void
  onClickMyInfo: () => void
}

export default function OrganizationAside({
  active,
  onClickOrgInfo,
  onClickLectureManage,
  onClickMyInfo,
}: OrganizationAsideProps) {
  const getButtonClass = (isActive: boolean) =>
    isActive
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  const getMobileButtonClass = (isActive: boolean) =>
    isActive
      ? 'flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium whitespace-nowrap'
      : 'flex-1 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 whitespace-nowrap'

  return (
    <>
      {/* Mobile/Tablet Top Tabs */}
      <div className="w-full lg:hidden">
        <nav className="flex w-full items-center gap-2 overflow-x-auto">
          <button
            onClick={onClickOrgInfo}
            aria-current={active === 'orgInfo' ? 'page' : undefined}
            className={getMobileButtonClass(active === 'orgInfo')}
          >
            기업정보 관리
          </button>
          <button
            onClick={onClickMyInfo}
            aria-current={active === 'myInfo' ? 'page' : undefined}
            className={getMobileButtonClass(active === 'myInfo')}
          >
            내 정보 관리
          </button>
          <button
            onClick={onClickLectureManage}
            aria-current={active === 'lectureManage' ? 'page' : undefined}
            className={getMobileButtonClass(active === 'lectureManage')}
          >
            강의 관리
          </button>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10 lg:block">
        <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>

        <nav className="space-y-2 text-sm leading-relaxed">
          <button
            onClick={onClickOrgInfo}
            className={getButtonClass(active === 'orgInfo')}
            aria-current={active === 'orgInfo' ? 'page' : undefined}
          >
            기업정보 관리
          </button>

          <button
            onClick={onClickMyInfo}
            className={getButtonClass(active === 'myInfo')}
            aria-current={active === 'myInfo' ? 'page' : undefined}
          >
            내 정보 관리
          </button>

          <button
            onClick={onClickLectureManage}
            className={getButtonClass(active === 'lectureManage')}
            aria-current={active === 'lectureManage' ? 'page' : undefined}
          >
            강의 관리
          </button>
        </nav>
      </aside>
    </>
  )
}
