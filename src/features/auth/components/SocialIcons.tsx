'use client'

import { FaGoogle, FaGithub } from 'react-icons/fa'

type SocialIconsProps = {
  onGoogle?: () => void
  onGithub?: () => void
}

export default function SocialIcons({ onGoogle, onGithub }: SocialIconsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          onGoogle?.()
        }}
        aria-label="Google로 가입"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:scale-105 hover:bg-white/15"
      >
        <FaGoogle className="text-red-500" size={18} />
      </button>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          onGithub?.()
        }}
        aria-label="GitHub로 가입"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:scale-105 hover:bg-white/15"
      >
        <FaGithub className="text-white" size={18} />
      </button>
    </div>
  )
}
