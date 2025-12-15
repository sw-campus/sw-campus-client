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
    <button
      type="button"
      onClick={onClick}
      className={`flex-[1.2] rounded-3xl bg-white/90 p-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${className ?? ''}`}
    >
      <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-2xl">
        <Image src={imageSrc} alt={imageAlt} width={200} height={200} className="object-contain" />
      </div>

      <div className="inline-flex items-center rounded-full bg-neutral-700 px-6 py-1 font-semibold text-white">
        {title}
      </div>

      {children}
    </button>
  )
}
