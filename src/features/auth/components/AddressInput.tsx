'use client'

import { toast } from 'sonner'

import { useSignupStore } from '@/store/signupStore'

const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

export default function AddressInput() {
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
