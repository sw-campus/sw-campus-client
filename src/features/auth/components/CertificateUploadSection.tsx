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
      <label className="mb-1 block text-white/75">재직증명서</label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            name="certificateImage"
            onChange={onChangeFile}
            className="h-10 w-full flex-1 rounded-md border border-white/15 bg-white/10 px-2 py-2 text-sm text-white/75 outline-none file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/85 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-black focus:border-white/35 focus:bg-white/15"
          />

          {onClickVerify && (
            <button
              type="button"
              onClick={onClickVerify}
              disabled={!certificateImage}
              className="h-10 shrink-0 rounded-md bg-white/85 px-4 text-sm font-semibold text-black transition hover:bg-white disabled:opacity-60"
            >
              확인
            </button>
          )}
        </div>

        {certificateImage && <p className="text-xs text-white/55">선택된 파일: {certificateImage.name}</p>}
      </div>
    </div>
  )
}
