export default function MyPage() {
  return (
    <div className="custom-container">
      <div className="custom-card">
        {/* 실제 내용 영역 */}
        <div className="relative z-10 flex w-full gap-6">
          {/* 왼쪽 사이드바 */}
          <aside className="w-52 self-start rounded-md bg-white/90 p-5 text-neutral-900">
            <h2 className="mb-4 text-2xl font-semibold">마이페이지</h2>

            <nav className="space-y-2 leading-relaxed">
              <button className="block w-full text-left font-medium text-neutral-900 hover:underline">
                기업정보관리
              </button>
              <button className="block w-full text-left text-neutral-700 hover:underline">강의 관리</button>
            </nav>
          </aside>

          {/* 오른쪽 본문 영역 (추후 내용 넣을 자리) */}
          <div className="flex-4 rounded-3xl bg-neutral-600/80">
            {/* TODO: 회원정보 / 찜한 강의 / 리뷰 내용 들어갈 자리 */}
          </div>
        </div>
      </div>
    </div>
  )
}
