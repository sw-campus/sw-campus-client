'use client'

import { FaGithub, FaGoogle } from 'react-icons/fa'

type SocialLoginButtonsProps = {
  onGoogle: () => void
  onGithub: () => void
}

export function SocialLoginButtons({ onGoogle, onGithub }: SocialLoginButtonsProps) {
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
    </div>
  )
}
