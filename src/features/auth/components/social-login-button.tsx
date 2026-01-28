'use client'

import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { RiKakaoTalkFill } from 'react-icons/ri'

type SocialLoginButtonsProps = {
  onGoogle: () => void
  onGithub: () => void
  onKakao: () => void
}

export function SocialLoginButtons({ onGoogle, onGithub, onKakao }: SocialLoginButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={onGoogle}
        aria-label="Google로 로그인"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-all duration-200 hover:scale-105 hover:bg-muted active:scale-95"
      >
        <FcGoogle size={22} />
      </button>

      <button
        type="button"
        onClick={onGithub}
        aria-label="GitHub로 로그인"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#24292f] transition-all duration-200 hover:scale-105 hover:bg-[#1b1f23] active:scale-95"
      >
        <FaGithub size={22} className="text-white" />
      </button>

      <button
        type="button"
        onClick={onKakao}
        aria-label="카카오로 로그인"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE500] transition-all duration-200 hover:scale-105 hover:bg-[#FDD835] active:scale-95"
      >
        <RiKakaoTalkFill size={22} className="text-[#191919]" />
      </button>
    </div>
  )
}
