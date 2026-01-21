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
    <>
      {/* 모바일/태블릿 상단 탭형 네비게이션 */}
      <nav className="mb-4 lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onClickPersonInfo}
            aria-current={active === 'password' ? 'page' : undefined}
            className={
              active === 'password'
                ? 'w-full rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white'
                : 'w-full rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700'
            }
          >
            개인정보
          </button>
          <button
            onClick={onClickSurveyManage}
            aria-current={active === 'survey' ? 'page' : undefined}
            className={
              active === 'survey'
                ? 'w-full rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white'
                : 'w-full rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700'
            }
          >
            설문
          </button>
          <button
            onClick={onClickReviewManage}
            aria-current={active === 'reviews' ? 'page' : undefined}
            className={
              active === 'reviews'
                ? 'w-full rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white'
                : 'w-full rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700'
            }
          >
            후기
          </button>
        </div>
      </nav>

      {/* 데스크톱 사이드바 (lg 이상) */}
      <aside className="hidden rounded-3xl border border-white/10 bg-white/90 p-5 text-neutral-900 shadow-lg shadow-black/10 lg:block lg:w-56 lg:self-start">
        <h2 className="mb-5 text-2xl font-semibold">마이페이지</h2>
        <nav className="space-y-2 text-base leading-relaxed">
          <button
            onClick={onClickPersonInfo}
            className={personInfoClass}
            aria-current={active === 'password' ? 'page' : undefined}
          >
            개인정보 관리
          </button>
          <button
            onClick={onClickSurveyManage}
            className={surveyClass}
            aria-current={active === 'survey' ? 'page' : undefined}
          >
            설문 조사
          </button>
          <button
            onClick={onClickReviewManage}
            className={reviewClass}
            aria-current={active === 'reviews' ? 'page' : undefined}
          >
            내 후기
          </button>
        </nav>
      </aside>
    </>
  )
}
