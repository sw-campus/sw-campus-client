'use client'

type PersonalAsideProps = {
  onClickOrgInfo: () => void
  onClickLectureManage: () => void
  onClickReviewManage: () => void
}

export default function PersonalAside({
  onClickOrgInfo,
  onClickLectureManage,
  onClickReviewManage,
}: PersonalAsideProps) {
  return (
    <aside className="w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10">
      <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>

      <nav className="space-y-2 text-sm leading-relaxed">
        <button
          onClick={onClickOrgInfo}
          className="block w-full rounded-lg px-3 py-2 text-left font-medium transition hover:bg-neutral-100"
        >
          개인정보 관리
        </button>

        <button
          onClick={onClickLectureManage}
          className="block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100"
        >
          설문 조사
        </button>

        <button
          onClick={onClickReviewManage}
          className="block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100"
        >
          내 후기
        </button>
      </nav>
    </aside>
  )
}
