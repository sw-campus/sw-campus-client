'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type AiAuthModalType = 'login' | 'survey' | null

interface AiAuthModalProps {
  type: AiAuthModalType
  onClose: () => void
}

/**
 * AI 비교 분석 기능 사용을 위한 인증/설문 안내 모달
 *
 * - login: 비로그인 사용자에게 로그인 안내
 * - survey: 로그인했지만 설문 미완료 사용자에게 설문 안내
 */
export function AiAuthModal({ type, onClose }: AiAuthModalProps) {
  const router = useRouter()

  if (!type) return null

  const handlePrimaryAction = () => {
    if (type === 'login') {
      router.push('/login?returnUrl=/cart/compare')
    } else if (type === 'survey') {
      // 설문 완료 후 비교 페이지로 복귀하도록 returnUrl 전달
      router.push('/mypage/survey?returnUrl=/cart/compare')
    }
    onClose()
  }

  const config = {
    login: {
      title: 'AI 비교 분석 기능',
      description: '로그인과 설문조사를 완료한 사람만 이 기능을 사용할 수 있습니다.',
      primaryText: '로그인하기',
      cancelText: '머무르기',
    },
    survey: {
      title: '설문조사가 필요합니다',
      description: '설문조사를 완료한 사람만 AI 비교 분석 기능을 사용할 수 있습니다.',
      primaryText: '설문하러 가기',
      cancelText: '나중에',
    },
  }

  const { title, description, primaryText, cancelText } = config[type]

  return (
    <Dialog open={!!type} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={handlePrimaryAction}>{primaryText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
