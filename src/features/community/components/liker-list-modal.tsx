'use client'

import { FiHeart } from 'react-icons/fi'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserAvatar } from '@/components/ui/user-avatar'

import { UserProfileLink } from './user-profile-link'
import { useLikers } from '../hooks/use-post-interactions'

interface LikerListModalProps {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LikerListModal({ postId, open, onOpenChange }: LikerListModalProps) {
  const { data: likers, isLoading } = useLikers(postId, open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiHeart className="h-5 w-5 text-rose-500" />
            좋아요
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">불러오는 중...</span>
            </div>
          ) : !likers || likers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FiHeart className="mb-2 h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">아직 좋아요가 없습니다</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {likers.map((liker) => (
                <li key={liker.id}>
                  <UserProfileLink
                    userId={liker.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                    onClick={() => onOpenChange(false)}
                  >
                    <UserAvatar nickname={liker.nickname} size="sm" />
                    <span className="font-medium text-foreground">{liker.nickname}</span>
                  </UserProfileLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
