'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useUpdateBannerMutation } from '../../hooks/useBanners'
import type { Banner } from '../../types/banner.type'
import { BannerForm, toApiRequest, type BannerFormData } from './BannerForm'

interface BannerEditModalProps {
  banner: Banner | null
  isOpen: boolean
  onClose: () => void
}

export function BannerEditModal({ banner, isOpen, onClose }: BannerEditModalProps) {
  const updateMutation = useUpdateBannerMutation()

  const handleSubmit = (formData: BannerFormData, imageFile: File | null) => {
    if (!banner) return

    updateMutation.mutate(
      {
        id: banner.id,
        request: toApiRequest(formData),
        imageFile: imageFile ?? undefined,
      },
      {
        onSuccess: onClose,
      },
    )
  }

  if (!banner) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>배너 수정</DialogTitle>
          <DialogDescription>배너 ID: {banner.id}</DialogDescription>
        </DialogHeader>
        <BannerForm
          initialBanner={banner}
          isSubmitting={updateMutation.isPending}
          submitText="수정"
          submittingText="수정 중..."
          onCancel={onClose}
          onSubmit={handleSubmit}
          imageRequired={false}
        />
      </DialogContent>
    </Dialog>
  )
}
