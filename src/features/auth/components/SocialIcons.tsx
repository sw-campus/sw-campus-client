'use client'

import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function SocialIcons() {
  return (
    <div className="flex justify-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:scale-105 hover:bg-white/15">
        <FaGoogle className="text-red-500" size={18} />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:scale-105 hover:bg-white/15">
        <FaGithub className="text-white" size={18} />
      </div>
    </div>
  )
}
