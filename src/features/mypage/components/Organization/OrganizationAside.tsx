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
    <aside className="w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10">
      <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>

      <nav className="space-y-2 text-sm leading-relaxed">
        <button onClick={onClickOrgInfo} className={orgInfoClass}>
          기업정보 관리
        </button>

        <button onClick={onClickLectureManage} className={lectureManageClass}>
          강의 관리
        </button>
      </nav>
    </aside>
  )
}
