'use client'

import { useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { FiCornerDownRight, FiEdit2, FiHeart, FiMessageCircle, FiMoreVertical, FiTrash2 } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAuthStore } from '@/store/authStore'

import type { Comment } from '../api/commentApi.types'
import { useDeleteComment, useUpdateComment, useToggleCommentLike } from '../hooks/useComments'
import { UserProfileLink } from './UserProfileLink'

interface CommentItemProps {
  comment: Comment
  postId: number
  onReply?: (parentId: number) => void
  depth?: number
}

const MAX_DEPTH = 3 // 권장: 3단계 (모바일 가독성 고려)

export function CommentItem({ comment, postId, onReply, depth = 0 }: CommentItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, userType } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(postId)
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId)
  const { mutate: toggleLike, isPending: isLiking } = useToggleCommentLike(postId)

  const handleUpdate = () => {
    if (!editBody.trim()) return
    updateComment(
      { commentId: comment.id, request: { body: editBody.trim() } },
      {
        onSuccess: () => setIsEditing(false),
      },
    )
  }

  const handleDelete = () => {
    deleteComment(comment.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    })
  }

  const handleLike = () => {
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true)
      return
    }
    toggleLike(comment.id)
  }

  const handleLoginRedirect = () => {
    setIsLoginDialogOpen(false)
    router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
  }

  const relativeTime = formatRelativeTime(comment.createdAt)

  // 삭제된 댓글 표시
  if (comment.isDeleted) {
    return (
      <div className={`${depth > 0 ? 'ml-2 border-l-2 border-gray-100 pl-2 sm:ml-6 sm:pl-5' : ''}`}>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center gap-2">
            {depth > 0 && <FiCornerDownRight className="h-4 w-4 text-gray-300" />}
            <p className="text-sm text-gray-400 italic">삭제된 댓글입니다.</p>
          </div>
        </div>

        {/* 대댓글은 여전히 표시 */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${depth > 0 ? 'ml-2 border-l-2 border-orange-100 pl-2 sm:ml-6 sm:pl-5' : ''}`}>
      <div className="group rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300/80 hover:shadow-md sm:p-5">
        {/* 작성자 정보 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {depth > 0 && <FiCornerDownRight className="h-4 w-4 text-orange-400" />}
            <UserProfileLink
              userId={comment.authorId}
              className="transition-transform hover:scale-110"
            >
              <UserAvatar nickname={comment.authorNickname} size="sm" avatarClassName="ring-2 ring-white" />
            </UserProfileLink>
            <div className="flex items-center gap-2">
              <UserProfileLink
                userId={comment.authorId}
                className="font-semibold text-gray-800 transition-colors hover:text-orange-600"
              >
                {comment.authorNickname}
              </UserProfileLink>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400" title={comment.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
              {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">수정됨</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* 좋아요 */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-all hover:bg-rose-50 active:scale-95 sm:px-2.5 sm:py-1 sm:text-xs ${
                comment.isLiked ? 'bg-rose-50 font-semibold text-rose-500' : 'text-gray-500 hover:text-rose-500'
              }`}
            >
              <FiHeart className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>

            {/* 더보기 메뉴 (작성자/관리자만) */}
            {isLoggedIn && (comment.isAuthor || userType === 'ADMIN') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2">
                    <FiEdit2 className="h-4 w-4" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="gap-2 text-rose-600 focus:text-rose-600"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* 본문 */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditBody(comment.body)
                }}
                className="rounded-lg"
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating || !editBody.trim()}
                className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm"
              >
                {isUpdating ? '수정 중...' : '수정'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{comment.body}</p>
        )}

        {/* 이미지 */}
        {comment.imageUrl && !isEditing && (
          // 사용자 업로드 이미지로 외부 URL이므로 img 태그 사용
          // eslint-disable-next-line @next/next/no-img-element
          <img src={comment.imageUrl} alt="댓글 이미지" className="mt-4 max-h-48 rounded-xl object-cover" />
        )}

        {/* 답글 버튼 */}
        {isLoggedIn && !isEditing && depth < MAX_DEPTH && onReply && (
          <div className="mt-3 border-t border-gray-100 pt-2 sm:mt-4 sm:pt-3">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-400 transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-95 sm:gap-1.5 sm:rounded-lg sm:px-3 sm:text-[13px]"
            >
              <FiMessageCircle className="h-3.5 w-3.5" />
              답글
            </button>
          </div>
        )}

        {/* 삭제 확인 다이얼로그 */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="mx-4 max-w-sm rounded-2xl sm:mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="rounded-xl bg-rose-500 hover:bg-rose-600"
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 대댓글 */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} depth={depth + 1} />
          ))}
        </div>
      )}

      {/* 로그인 필요 다이얼로그 */}
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-sm rounded-2xl sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>로그인 필요</AlertDialogTitle>
            <AlertDialogDescription>
              좋아요를 누르려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect} className="rounded-xl">
              로그인하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
