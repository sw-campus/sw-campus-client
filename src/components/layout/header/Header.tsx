'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiLogIn, FiUser, FiHeart, FiMenu, FiLogOut } from 'react-icons/fi'

import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const router = useRouter()
  const { logout: clearAuth } = useAuthStore()
  const { isLoggedIn, userName, logout } = useAuthStore()

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout() // 서버에서 쿠키 삭제
      clearAuth() // 클라이언트 상태 초기화
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header className="sticky top-0 z-50 mx-auto mt-6 flex w-full max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-8">
        {/* 햄버거 버튼 */}
        <button className="text-white md:hidden">
          <FiMenu size={22} />
        </button>

        {/* 로고 -> 나중에 이미지로 교체 */}
        <Link href="/" className="flex flex-col leading-tight font-extrabold text-white">
          <span>SOFTWARE</span>
          <span>CAMPUS</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 text-sm text-white md:flex">
        <Link href="/">부트캠프</Link>
        <Link href="/">훈련 기관</Link>
        <Link href="/">커뮤니케이션</Link>
      </nav>

      {/* 아이콘 */}
      <div className="flex items-center gap-6 text-xl text-white">
        {/* 로그인 여부에 따라 UI 변경 */}
        {isLoggedIn ? (
          <>
            {/* 로그인된 경우 */}
            <span className="text-sm font-medium">{userName ?? '사용자'}님</span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm transition hover:opacity-80"
            >
              <FiLogOut className="text-xl" />
              <Link href="/mypage/organization">
                <FiUser className="text-xl" />
              </Link>
              <Link href="/">
                <FiHeart className="text-xl" />
              </Link>
            </button>
          </>
        ) : (
          <>
            {/* 로그인 안된 경우 */}
            <Link href="/login">
              <FiLogIn />
            </Link>
            <Link href="/mypage/organization">
              <FiUser />
            </Link>
            <Link href="/">
              <FiHeart />
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
