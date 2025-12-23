'use client'

type PersonalAsideProps = {
  active: 'password' | 'survey' | 'reviews'
  onClickPersonInfo: () => void
  onClickSurveyManage: () => void
  onClickReviewManage: () => void
}

export default function PersonalAside({
  active,
  onClickPersonInfo,
  onClickSurveyManage,
  onClickReviewManage,
}: PersonalAsideProps) {
  const personInfoClass =
    active === 'password'
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  const surveyClass =
    active === 'survey'
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  const reviewClass =
    active === 'reviews'
      ? 'block w-full rounded-lg bg-neutral-100 px-3 py-2 text-left font-medium transition'
      : 'block w-full rounded-lg px-3 py-2 text-left text-neutral-700 transition hover:bg-neutral-100'

  return (
    <aside className="w-56 self-start rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10">
      <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>

      <nav className="space-y-2 text-sm leading-relaxed">
        <button onClick={onClickPersonInfo} className={personInfoClass}>
          개인정보 관리
        </button>

        <button onClick={onClickSurveyManage} className={surveyClass}>
          설문 조사
        </button>

        <button onClick={onClickReviewManage} className={reviewClass}>
          내 후기
        </button>
      </nav>
    </aside>
  )
}
