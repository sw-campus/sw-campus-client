import Image from 'next/image'
import Link from 'next/link'
import { FiLogIn, FiUser, FiHeart, FiMenu } from 'react-icons/fi'

export default function Header({
  onOpenNav,
  onBootcampEnter,
  onOtherNavEnter,
}: {
  onOpenNav: () => void
  onBootcampEnter: () => void
  onOtherNavEnter: () => void
}) {
  return (
    <header className="sticky top-0 z-50 mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-10 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-8">
        {/* 햄버거 버튼 */}
        <button className="text-white md:hidden" onClick={onOpenNav}>
          <FiMenu size={22} />
        </button>

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={48}
            height={48}
            className="shrink-0 object-contain"
            priority
          />

          <div className="flex h-12 translate-y-px flex-col justify-center leading-none font-extrabold tracking-tight text-white">
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 text-sm text-white md:flex">
        <Link
          href="/lectures/search"
          onMouseEnter={onBootcampEnter}
          onFocus={onBootcampEnter}
          onClick={onBootcampEnter}
        >
          부트캠프
        </Link>
        <Link href="/" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          훈련 기관
        </Link>
        <Link href="/" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          커뮤니케이션
        </Link>
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
