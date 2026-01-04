'use client'

import React from 'react'

import Image from 'next/image'

type Props = {
  title: string
  imageSrc: string
  imageAlt: string
  onClick: () => void
  children?: React.ReactNode
  className?: string
}

export default function SignupCard({ title, imageSrc, imageAlt, onClick, children, className }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`flex flex-1 cursor-pointer flex-col items-center rounded-3xl border border-white/15 bg-white/10 p-5 text-center text-white shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 hover:bg-white/15 md:p-6 ${className ?? ''}`}
    >
      <div className="relative mb-4 h-24 w-full overflow-hidden rounded-2xl bg-white/5 md:h-28">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain object-center p-2"
        />
      </div>

      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-1 text-sm font-semibold text-white">
        {title}
      </div>

      <div className="mt-4 flex min-h-10 items-center justify-center">{children}</div>
    </div>
  )
}
