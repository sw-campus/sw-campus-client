'use client'

import { useState, useCallback } from 'react'
import type { MouseEvent, FormEvent } from 'react'

import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { CourseRegistrationForm } from '@/features/mypage/organization/components/CourseRegistrationForm'

export default function OrganizationCourseModal() {
  const router = useRouter()
  const [closing, setClosing] = useState(false)

  const closeModal = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      router.back()
    }, 160) // fade-out duration
  }, [router])

  // Backdrop click
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal()
  }

  // ESC
  const handleKeyDown = (event: any) => {
    if (event.key === 'Escape') closeModal()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${closing ? 'opacity-0' : 'opacity-100'} `}
      onClick={handleBackdropClick}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-150 ${closing ? 'opacity-0' : 'opacity-100'} `}
      />

      {/* modal */}
      <div
        className={`relative z-10 max-h-[90vh] w-full max-w-4xl transform overflow-y-auto rounded-3xl border border-white/20 bg-white/90 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.65)] backdrop-saturate-150 transition-all duration-150 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} `}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">교육과정 등록</p>
            <h2 id="modal-title" className="mt-1 text-2xl font-semibold text-slate-900">
              새로운 교육과정을 만들어보세요
            </h2>
            <p id="modal-desc" className="mt-1 text-sm text-slate-500">
              필요한 데이터를 입력하면 내부 검토를 거쳐 조직 내 학습 공간에 등록됩니다.
            </p>
          </div>

          <Button className="rounded-full" variant="ghost" size="icon" onClick={closeModal}>
            <XIcon className="size-4" />
            <span className="sr-only">모달 닫기</span>
          </Button>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <CourseRegistrationForm />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit">등록하기</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
