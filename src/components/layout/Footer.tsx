import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 mb-10 w-full max-w-7xl rounded-3xl border border-white/15 bg-white/10 p-10 pb-10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-white">SOFTWARE CAMPUS</div>

        {/* 메뉴 */}
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <a className="text-white/90 hover:text-white" href="#">
            서비스 이용약관
          </a>
          <span className="text-white/30">|</span>
          <a className="text-white/90 hover:text-white" href="#">
            개인정보처리방침
          </a>
          <span className="text-white/30">|</span>
          <a className="text-white/90 hover:text-white" href="#">
            교육과정 등록
          </a>
        </nav>
      </div>

      {/* 회사 정보 */}
      <div className="mt-8 text-sm leading-relaxed text-white/80">
        한국소프트웨어기술진흥협회
        <br />
        서울특별시 종로구 우정국로 2길 21 대왕빌딩 7층
        <br />
        Tel.031-606-9311 | E-mail.kosta@kosta.or.kr
      </div>

      {/* 하단 설명 */}
      <div className="mt-6 text-xs leading-relaxed text-white/70">
        본 웹사이트 내의 교육과정 및 운영 정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 <br />
        무단 복제, 배포, 가공, 크롤링, 스크래핑 등의 행위는 저작권법, 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에
        의하여 엄격히 금지됩니다.
      </div>

      <div className="mt-10 text-xs text-white/50">Copyright © KOSTA</div>
    </footer>
  )
}
