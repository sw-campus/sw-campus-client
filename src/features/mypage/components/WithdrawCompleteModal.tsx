'use client'

import { useRouter } from 'next/navigation'
import { LuBadgeCheck, LuExternalLink } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/store/authStore'

type WithdrawCompleteModalProps = {
  open: boolean
  oauthProviders: string[]
}

const PROVIDER_LINKS: Record<string, { name: string; url: string }> = {
  GITHUB: {
    name: 'GitHub',
    url: 'https://github.com/settings/applications',
  },
  GOOGLE: {
    name: 'Google',
    url: 'https://myaccount.google.com/connections',
  },
}

export function WithdrawCompleteModal({ open, oauthProviders }: WithdrawCompleteModalProps) {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleClose = () => {
    logout()
    router.push('/')
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[480px]" onPointerDownOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <LuBadgeCheck className="h-5 w-5" />
            탈퇴 완료
          </DialogTitle>
          <DialogDescription className="pt-2 text-left">
            회원 탈퇴가 완료되었습니다.
            <br />
            그동안 SW Campus를 이용해 주셔서 감사합니다.
          </DialogDescription>
        </DialogHeader>

        {oauthProviders.length > 0 && (
          <div className="bg-muted/50 mt-2 space-y-3 rounded-lg p-4">
            <p className="text-foreground text-sm font-medium">🔗 연결된 계정의 앱 연결을 해제해 주세요</p>
            <div className="space-y-2">
              {oauthProviders.map(provider => {
                const linkInfo = PROVIDER_LINKS[provider]
                if (!linkInfo) return null
                return (
                  <a
                    key={provider}
                    href={linkInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <LuExternalLink className="h-4 w-4" />
                    {linkInfo.name} 계정 연결 해제하기
                  </a>
                )
              })}
            </div>
            <p className="text-muted-foreground text-xs">위 링크에서 SW Campus 앱을 찾아 연결을 해제할 수 있습니다.</p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
