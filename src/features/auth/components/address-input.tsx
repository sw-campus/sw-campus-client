'use client'

import { useEffect, useState } from 'react'

import { LuX } from 'react-icons/lu'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { INPUT_BASE_CLASS } from '@/features/auth/input-base-class'
import { useSignupStore } from '@/store/signup-store'

/** Daum 우편번호 서비스 응답 타입 */
interface DaumPostcodeData {
  roadAddress: string
  jibunAddress: string
  zonecode: string
}

/** Daum 우편번호 서비스 인스턴스 타입 */
interface DaumPostcodeInstance {
  open: () => void
  embed: (container: HTMLElement, options?: { autoClose?: boolean }) => void
}

/** Daum 우편번호 서비스 생성자 옵션 */
interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void
  onclose?: () => void
  width?: string | number
  height?: string | number
}

/** Daum 전역 객체 타입 */
interface DaumGlobal {
  Postcode: new (options: DaumPostcodeOptions) => DaumPostcodeInstance
}

type AddressInputProps = {
  autoOpen?: boolean
  variant?: 'dark' | 'light'
  required?: boolean
  error?: string
}

// 마이페이지용 밝은 테마 스타일 (디자인 토큰 적용)
const INPUT_LIGHT_CLASS =
  'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50 focus:outline-none'

export default function AddressInput({ autoOpen = false, variant = 'dark', required = false, error }: AddressInputProps) {
  const { address, setAddress } = useSignupStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const inputClass = variant === 'light' ? INPUT_LIGHT_CLASS : `${INPUT_BASE_CLASS} w-full flex-1`
  const labelClass =
    variant === 'light' ? 'text-foreground mb-1 block text-sm font-medium' : 'text-muted-foreground mb-1 block'
  const buttonClass =
    variant === 'light'
      ? 'bg-foreground text-background hover:bg-foreground/90 h-10 shrink-0 rounded-md px-4 text-sm font-semibold'
      : 'h-10 rounded-md bg-orange-500 px-4 font-semibold text-white transition hover:bg-orange-600'

  const handleSearchAddress = () => {
    if (typeof window === 'undefined') return

    const daum = (window as Window & { daum?: DaumGlobal }).daum
    if (!daum || !daum.Postcode) {
      toast.error('주소 검색 스크립트가 아직 로드되지 않았어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    setIsDialogOpen(true)
  }

  // Dialog가 열리면 embed 실행
  const handleDialogMount = (node: HTMLDivElement | null) => {
    if (!node) return
    // 이미 embed 중이면 중복 실행 방지
    if (node.childElementCount > 0) return

    const daum = (window as Window & { daum?: DaumGlobal }).daum
    if (!daum || !daum.Postcode) return

    new daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        const fullAddress = data.roadAddress || data.jibunAddress
        useSignupStore.getState().setAddress(fullAddress)
        setIsDialogOpen(false)
      },
      width: '100%',
      height: '100%',
    }).embed(node)
  }

  // autoOpen 지원
  useEffect(() => {
    if (!autoOpen) return

    const tryOpen = () => {
      if (typeof window === 'undefined') return false
      const daum = (window as Window & { daum?: DaumGlobal }).daum
      if (!daum || !daum.Postcode) return false
      handleSearchAddress()
      return true
    }

    if (tryOpen()) return
    let attempts = 0
    const maxAttempts = 10
    const intervalMs = 150
    const id = setInterval(() => {
      attempts += 1
      if (tryOpen()) {
        clearInterval(id)
        return
      }
      if (attempts >= maxAttempts) {
        clearInterval(id)
        toast.error('주소 검색 도구를 불러오지 못했어요. 네트워크 상태를 확인한 뒤 잠시 후 다시 시도해 주세요.')
      }
    }, intervalMs)

    return () => clearInterval(id)
  }, [autoOpen])

  return (
    <>
      <div className="mb-3">
        <label className={labelClass}>
          주소 {required && <span className="text-destructive">*</span>}
        </label>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="주소를 검색하거나 직접 입력하세요"
            className={`${inputClass} ${error ? 'border-destructive' : ''}`}
            value={address ?? ''}
            onChange={e => setAddress(e.target.value)}
          />
          <button type="button" onClick={handleSearchAddress} className={buttonClass}>
            검색
          </button>
        </div>
        {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      </div>

      {/* 별도 Dialog에서 Daum Postcode embed — 폼 DOM과 완전 분리 (portal) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="
            !flex !flex-col !gap-0 !p-0
            !inset-0 !max-h-full !max-w-full !translate-x-0 !translate-y-0 !rounded-none
            sm:!inset-auto sm:!top-1/2 sm:!left-1/2 sm:!-translate-x-1/2 sm:!-translate-y-1/2
            sm:!max-h-[600px] sm:!max-w-[500px] sm:!rounded-lg
          "
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <DialogTitle className="text-base font-semibold">주소 검색</DialogTitle>
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground rounded p-1"
              aria-label="닫기"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>
          <div ref={handleDialogMount} className="min-h-0 flex-1" />
        </DialogContent>
      </Dialog>
    </>
  )
}
