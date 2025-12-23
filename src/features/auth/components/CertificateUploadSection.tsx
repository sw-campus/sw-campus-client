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
      <label className="mb-1 block text-neutral-700">재직증명서</label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="file"
            name="certificateImage"
            accept=".pdf,image/*"
            onChange={onChangeFile}
            className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-2 py-1 text-sm outline-none file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white focus:border-neutral-500 focus:bg-white"
          />
        </div>
        {certificateImage && <p className="text-xs text-neutral-500">선택된 파일: {certificateImage.name}</p>}
      </div>
    </div>
  )
}
