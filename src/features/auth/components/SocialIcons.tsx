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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:scale-105 hover:bg-gray-50"
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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:scale-105 hover:bg-gray-50"
      >
        <FaGithub className="text-gray-900" size={18} />
      </button>
    </div>
  )
}
