'use client'

import { useEffect } from 'react'

import { toast } from 'sonner'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'
import { useSignupStore } from '@/store/signupStore'

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
  }, [autoOpen])

  return (
    <div className="mb-3">
      <label className="mb-1 block text-white/75">주소</label>
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
          className="h-10 rounded-md bg-white/85 px-4 font-semibold text-black transition hover:bg-white"
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
