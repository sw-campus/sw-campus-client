import Link from 'next/link'
import { FiLogIn, FiUser, FiHeart } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      {/* 로고 -> 나중에 이미지로 교체 */}
      <Link href="/" className="flex flex-col leading-tight font-extrabold tracking-tight text-white">
        <span>SOFTWARE</span>
        <span>CAMPUS</span>
      </Link>

      {/* 네비게이션 */}
      <nav className="hidden gap-8 text-sm text-white md:flex">
        <Link href="/">부트캠프</Link>
        <Link href="/">훈련 기관</Link>
        <Link href="/">커뮤니케이션</Link>
      </nav>

      {/* 아이콘 */}
      <div className="flex items-center gap-6 text-xl text-white">
        <Link href="/login">
          <FiLogIn />
        </Link>
        <Link href="/mypage/organization">
          <FiUser />
        </Link>
        <Link href="/">
          <FiHeart />
        </Link>
      </div>
    </header>
  )
}
