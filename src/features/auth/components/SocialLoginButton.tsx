'use client'

import { FaGithub, FaGoogle } from 'react-icons/fa'
import { RiKakaoTalkFill } from 'react-icons/ri'

type SocialLoginButtonsProps = {
  onGoogle: () => void
  onGithub: () => void
  onKakao: () => void
}

export function SocialLoginButtons({ onGoogle, onGithub, onKakao }: SocialLoginButtonsProps) {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button
        type="button"
        onClick={onGoogle}
        aria-label="Google로 로그인"
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100"
      >
        <FaGoogle className="text-red-500" size={18} />
      </button>

      <button
        type="button"
        onClick={onGithub}
        aria-label="GitHub로 로그인"
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100"
      >
        <FaGithub className="text-black" size={18} />
      </button>

      <button
        type="button"
        onClick={onKakao}
        aria-label="카카오로 로그인"
        className="flex h-10 w-10 items-center justify-center rounded-full border bg-[#FEE500] transition hover:scale-105 hover:bg-[#FDD800]"
      >
        <RiKakaoTalkFill className="text-[#391B1B]" size={20} />
      </button>
    </div>
  )
}
