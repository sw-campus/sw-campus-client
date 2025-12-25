'use client'

import { useEffect, useRef, useState } from 'react'

import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  maxWidthClass?: string // e.g., "max-w-2xl"
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, maxWidthClass = 'max-w-2xl', children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onMouseDown={onOverlayClick}
    >
      <div
        ref={panelRef}
        className={`mx-4 w-full ${maxWidthClass} rounded-2xl border border-gray-200 bg-white shadow-[0_20px_48px_rgba(0,0,0,0.35)]`}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
          <button
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 hover:bg-gray-100 hover:text-neutral-900"
            onClick={onClose}
          >
            {/* X icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-8 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
