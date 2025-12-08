export default function MyPage() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* 전체 마이페이지 영역 */}
      <section className="flex min-h-[500px] w-full items-center justify-center px-6 py-10">
        {/* 실제 내용 영역 */}
        <div className="relative z-10 flex w-full gap-6">
          {/* 왼쪽 사이드바 */}
          <aside className="w-52 self-start rounded-md bg-white/90 p-5 text-xs text-neutral-900">
            <h2 className="mb-4 text-2xl font-semibold">마이페이지</h2>

            <nav className="space-y-2 text-[13px] leading-relaxed">
              <button className="block w-full text-left font-medium text-neutral-900 hover:underline">
                회원정보 수정
              </button>
              <button className="block w-full text-left text-neutral-700 hover:underline">찜한 강의</button>
              <button className="block w-full text-left text-neutral-700 hover:underline">내가 쓴 리뷰</button>
            </nav>
          </aside>

          {/* 오른쪽 본문 영역 (추후 내용 넣을 자리) */}
          <div className="flex-4 rounded-3xl bg-neutral-600/80">
            {/* TODO: 회원정보 / 찜한 강의 / 리뷰 내용 들어갈 자리 */}
          </div>
        </div>
      </section>
    </div>
  )
}
