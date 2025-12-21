'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { useCreateBannerMutation } from '../../hooks/useBanners'
import { BannerForm, toApiRequest, type BannerFormData } from './BannerForm'

interface BannerCreateModalProps {
  trigger?: React.ReactNode
}

export function BannerCreateModal({ trigger }: BannerCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const createMutation = useCreateBannerMutation()

  /**
   * 폼 상태를 초기화합니다.
   * formKey를 변경하여 BannerForm 컴포넌트를 새로 마운트시킵니다.
   */
  const resetForm = useCallback(() => {
    setFormKey(prev => prev + 1)
  }, [])

  /**
   * 모달을 닫고 폼을 초기화합니다.
   */
  const closeAndReset = useCallback(() => {
    setOpen(false)
    resetForm()
  }, [resetForm])

  const handleSubmit = (formData: BannerFormData, imageFile: File | null) => {
    createMutation.mutate(
      {
        request: toApiRequest(formData),
        imageFile: imageFile ?? undefined,
      },
      {
        onSuccess: closeAndReset,
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button>배너 등록</Button>}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 배너 등록</DialogTitle>
          <DialogDescription>새로운 배너를 등록합니다.</DialogDescription>
        </DialogHeader>
        <BannerForm
          key={formKey}
          isSubmitting={createMutation.isPending}
          submitText="등록"
          submittingText="등록 중..."
          onCancel={closeAndReset}
          onSubmit={handleSubmit}
          imageRequired={true}
        />
      </DialogContent>
    </Dialog>
  )
}
