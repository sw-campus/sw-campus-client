'use client'

import { useEffect } from 'react'

import { toast } from 'sonner'

import { useSignupStore } from '@/store/signupStore'

const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

type AddressInputProps = {
  autoOpen?: boolean
}

export default function AddressInput({ autoOpen = false }: AddressInputProps) {
  const { address, detailAddress, setDetailAddress } = useSignupStore()

  const handleSearchAddress = () => {
    if (typeof window === 'undefined') return

    const { daum } = window as any
    if (!daum || !daum.Postcode) {
      toast.error('주소 검색 스크립트가 아직 로드되지 않았어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    new daum.Postcode({
      oncomplete: (data: any) => {
        const fullAddress = data.roadAddress || data.jibunAddress
        useSignupStore.getState().setAddress(fullAddress)
      },
    }).open()
  }

  // 수정 버튼으로 전환되자마자 모달 자동 오픈
  useEffect(() => {
    if (!autoOpen) return

    const tryOpen = () => {
      if (typeof window === 'undefined') return false
      const { daum } = window as any
      if (!daum || !daum.Postcode) return false
      handleSearchAddress()
      return true
    }

    // 즉시 시도 후, 스크립트 로딩 지연 대비하여 짧게 재시도
    if (tryOpen()) return
    let attempts = 0
    const id = setInterval(() => {
      attempts += 1
      if (tryOpen() || attempts >= 10) {
        clearInterval(id)
      }
    }, 150)
    return () => clearInterval(id)
  }, [autoOpen])

  return (
    <div className="mb-3">
      <label className="mb-1 block text-neutral-700">주소</label>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          placeholder="주소"
          className={`${INPUT_BASE_CLASS} w-full flex-1`}
          value={address ?? ''}
          readOnly
        />
        <button
          type="button"
          onClick={handleSearchAddress}
          className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white"
        >
          검색
        </button>
      </div>

      <input
        type="text"
        placeholder="상세 주소"
        className={`${INPUT_BASE_CLASS} w-full`}
        value={detailAddress ?? ''}
        onChange={e => setDetailAddress(e.target.value)}
      />
    </div>
  )
}
