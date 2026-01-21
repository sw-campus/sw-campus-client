'use client'

import { ChangeEvent } from 'react'

type CertificateUploadSectionProps = {
  certificateImage: File | null
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void
  onClickVerify?: () => void
}

export default function CertificateUploadSection({
  certificateImage,
  onChangeFile,
  onClickVerify,
}: CertificateUploadSectionProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-gray-700">재직증명서</label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            name="certificateImage"
            onChange={onChangeFile}
            className="h-10 w-full flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-700 outline-none file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-orange-500 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white focus:border-orange-300 focus:bg-white"
          />

          {onClickVerify && (
            <button
              type="button"
              onClick={onClickVerify}
              disabled={!certificateImage}
              className="h-10 shrink-0 rounded-md bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              확인
            </button>
          )}
        </div>

        {certificateImage && <p className="text-xs text-gray-500">선택된 파일: {certificateImage.name}</p>}
      </div>
    </div>
  )
}
