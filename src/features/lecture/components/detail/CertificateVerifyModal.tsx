'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'

import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'

interface CertificateVerifyModalProps {
  isOpen: boolean
  onClose: () => void
  lectureId: string
  verifyStep: 'select' | 'processing'
  file: File | null
  previewUrl: string | null
  error: string | null
  uploading: boolean
  onFileChange: (file: File | null, previewUrl: string | null) => void
  onUpload: () => void
}

export function CertificateVerifyModal({
  isOpen,
  onClose,
  verifyStep,
  file,
  previewUrl,
  error,
  uploading,
  onFileChange,
  onUpload,
}: CertificateVerifyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수료증 인증" maxWidthClass="max-w-lg">
      {verifyStep === 'select' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">수료증 이미지를 업로드하여 인증해 주세요.</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">수료증 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const f = e.target.files?.[0] ?? null
                const newPreviewUrl = f ? URL.createObjectURL(f) : null
                onFileChange(f, newPreviewUrl)
              }}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
            />
            {file && <p className="text-xs text-gray-500">선택됨: {file.name}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" className="rounded-full" onClick={onClose} disabled={uploading}>
              취소
            </Button>
            <Button className="rounded-full" disabled={uploading} onClick={onUpload}>
              업로드
            </Button>
          </div>
        </div>
      ) : (
        <ScanningView previewUrl={previewUrl} />
      )}
    </Modal>
  )
}

/** 수료증 스캔 애니메이션 뷰 */
function ScanningView({ previewUrl }: { previewUrl: string | null }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-sm font-semibold text-gray-800">수료증 등록</p>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">수료증을 제출하고 있습니다.</h2>

        {/* 스캔 애니메이션 컨테이너 */}
        <div className="relative overflow-hidden rounded-xl border-2 border-blue-400 bg-gray-900 p-3">
          {/* 코너 프레임 */}
          <div className="pointer-events-none absolute top-2 left-2 h-6 w-6 border-t-2 border-l-2 border-cyan-400" />
          <div className="pointer-events-none absolute top-2 right-2 h-6 w-6 border-t-2 border-r-2 border-cyan-400" />
          <div className="pointer-events-none absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-cyan-400" />
          <div className="pointer-events-none absolute right-2 bottom-2 h-6 w-6 border-r-2 border-b-2 border-cyan-400" />

          {previewUrl ? (
            <div className="relative">
              <Image
                src={previewUrl}
                alt="업로드한 수료증"
                width={800}
                height={600}
                className="mx-auto h-auto max-h-[50vh] w-auto rounded-md opacity-90"
                unoptimized
              />

              {/* 스캔 라인 애니메이션 */}
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  animation: 'scanLine 2s ease-in-out infinite',
                  boxShadow: '0 0 20px 5px rgba(34, 211, 238, 0.6)',
                }}
              />

              {/* 오버레이 그리드 효과 */}
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.3) 25%, rgba(34, 211, 238, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.3) 75%, rgba(34, 211, 238, 0.3) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, 0.3) 25%, rgba(34, 211, 238, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.3) 75%, rgba(34, 211, 238, 0.3) 76%, transparent 77%, transparent)`,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">이미지를 불러오는 중...</div>
          )}
        </div>

        {/* 진행 상태 표시 */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-cyan-600">
            <div className="relative flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500">
                <Loader2 className="h-3 w-3 animate-spin text-white" />
              </span>
            </div>
            <span>업로드 중...</span>
          </div>

          {/* 프로그레스 바 */}
          <div className="mx-auto w-48 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                animation: 'progressBar 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes scanLine {
          0%,
          100% {
            top: 0%;
          }
          50% {
            top: calc(100% - 4px);
          }
        }
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}
