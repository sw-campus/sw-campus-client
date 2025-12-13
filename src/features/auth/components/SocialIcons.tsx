'use client'

import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function SocialIcons() {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
        <FaGoogle className="text-red-500" size={18} />
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:scale-105 hover:bg-neutral-100">
        <FaGithub className="text-black" size={18} />
      </div>
    </div>
  )
}
