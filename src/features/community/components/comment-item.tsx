'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { FiEdit2, FiHeart, FiMessageCircle, FiMoreVertical, FiSend, FiTrash2, FiX } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { cn } from '@/lib/utils'

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
import { formatRelativeTime } from '@/lib/format-relative-time'
import { useAuthStore } from '@/store/auth-store'

import type { Comment } from '../api/comment-api.types'
import { useDeleteComment, useUpdateComment, useToggleCommentLike } from '../hooks/use-comments'
import type { ReplyFormProps } from './comment-section'
import { UserProfileLink } from './user-profile-link'

interface CommentItemProps {
  comment: Comment
  postId: number
  onReply?: (parentId: number) => void
  depth?: number
  replyFormProps?: ReplyFormProps
}

const MAX_DEPTH = 3 // 권장: 3단계 (모바일 가독성 고려)

export function CommentItem({ comment, postId, onReply, depth = 0, replyFormProps }: CommentItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, userType } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)

  // 인라인 답글 입력폼용 ref
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const isReplyFormVisible = replyFormProps?.replyToId === comment.id

  // 답글 폼이 열리면 자동 포커스
  useEffect(() => {
    if (isReplyFormVisible && replyTextareaRef.current) {
      replyTextareaRef.current.focus()
    }
  }, [isReplyFormVisible])

  // URL 해시가 이 댓글을 가리키면 스크롤 및 하이라이트
  useEffect(() => {
    const scrollToComment = () => {
      const hash = window.location.hash
      if (hash === `#comment-${comment.id}` && commentRef.current) {
        commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setIsHighlighted(true)
        setTimeout(() => {
          setIsHighlighted(false)
        }, 2500)
      }
    }

    // 초기 로드 시 체크
    scrollToComment()

    // 같은 페이지에서 해시 변경 시 체크
    window.addEventListener('hashchange', scrollToComment)
    return () => window.removeEventListener('hashchange', scrollToComment)
  }, [comment.id])

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
  const hasReplies = comment.replies.length > 0

  // 삭제된 댓글 처리
  if (comment.isDeleted) {
    // 대댓글이 없으면 표시하지 않음
    if (!hasReplies) {
      return null
    }

    // 대댓글이 있으면 "삭제된 댓글입니다" 표시
    return (
      <div ref={commentRef} id={`comment-${comment.id}`} className={cn('flex', { 'animate-highlight': isHighlighted })}>
        {/* 왼쪽: 아바타 + 스레드 라인 */}
        <div className="mr-3 flex flex-col items-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <div className="h-3 w-3 rounded-full bg-gray-300" />
          </div>
          {/* 스레드 라인 - 대댓글까지 이어짐 */}
          {hasReplies && !isCollapsed && (
            <div className="mt-2 w-0.5 flex-1 rounded-full bg-gray-200" />
          )}
        </div>

        {/* 오른쪽: 본문 + 대댓글 */}
        <div className="min-w-0 flex-1">
          <p className="pt-1.5 text-sm text-gray-400 italic">삭제된 댓글입니다.</p>

          {/* 대댓글 */}
          {!isCollapsed && hasReplies && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} depth={depth + 1} replyFormProps={replyFormProps} />
              ))}
              {/* 답글 숨기기 버튼 */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-xs text-gray-400 hover:text-orange-500"
              >
                ↑ 답글 숨기기
              </button>
            </div>
          )}

          {/* 접힌 상태 표시 */}
          {isCollapsed && hasReplies && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="mt-2 text-xs text-gray-400 hover:text-orange-500"
            >
              ↓ {comment.replies.length}개의 답글 보기
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={commentRef} id={`comment-${comment.id}`} className={cn('flex', { 'animate-highlight': isHighlighted })}>
      {/* 왼쪽: 아바타 + 스레드 라인 */}
      <div className="mr-3 flex flex-col items-center">
        <UserProfileLink
          userId={comment.authorId}
          className="shrink-0 transition-transform hover:scale-105"
        >
          <UserAvatar nickname={comment.authorNickname} size="sm" avatarClassName="ring-2 ring-white shadow-sm" />
        </UserProfileLink>
        {/* 스레드 라인 - 대댓글까지 이어짐 */}
        {hasReplies && !isCollapsed && (
          <div className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-orange-200 to-orange-100" />
        )}
      </div>

      {/* 오른쪽: 본문 + 대댓글 */}
      <div className="min-w-0 flex-1">
        <div className="group rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300/80 hover:shadow-md">
          {/* 작성자 정보 */}
          <div className="mb-2 flex items-center justify-between">
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

            <div className="flex items-center gap-1">
              {/* 좋아요 */}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-all hover:bg-rose-50 active:scale-95 ${
                  comment.isLiked ? 'bg-rose-50 font-semibold text-rose-500' : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                <FiHeart className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
              </button>

              {/* 더보기 메뉴 (작성자/관리자만) */}
              {isLoggedIn && (comment.isAuthor || userType === 'ADMIN') && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
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
            <img src={comment.imageUrl} alt="댓글 이미지" className="mt-3 max-h-48 rounded-xl object-cover" />
          )}

          {/* 답글 버튼 */}
          {isLoggedIn && !isEditing && depth < MAX_DEPTH && onReply && (
            <div className="mt-2 pt-2">
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-95"
              >
                <FiMessageCircle className="h-3.5 w-3.5" />
                답글
              </button>
            </div>
          )}
        </div>

        {/* 인라인 답글 입력 폼 */}
        {isReplyFormVisible && replyFormProps && (
          <form onSubmit={replyFormProps.onSubmit} className="mt-3">
            <div className="overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50 shadow-sm transition-shadow focus-within:border-orange-300 focus-within:shadow-lg focus-within:shadow-orange-100/50">
              <div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50/50 px-4 py-2 text-sm">
                <span className="font-medium text-orange-700">@{comment.authorNickname}</span>
                <span className="text-orange-600/70">님에게 답글 작성 중</span>
                <button
                  type="button"
                  onClick={replyFormProps.onCancel}
                  className="ml-auto flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-orange-100 active:scale-90"
                >
                  <FiX className="h-3.5 w-3.5 text-orange-600" />
                </button>
              </div>
              <textarea
                ref={replyTextareaRef}
                value={replyFormProps.body}
                onChange={(e) => replyFormProps.setBody(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="min-h-[70px] w-full resize-none border-0 bg-transparent p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:min-h-[80px]"
                rows={2}
              />
              <div className="flex items-center justify-end border-t border-orange-100 bg-orange-50/30 px-3 py-2">
                <Button
                  type="submit"
                  disabled={replyFormProps.isCreating || !replyFormProps.body.trim()}
                  className="h-9 gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-semibold shadow-md shadow-orange-200/50 transition-all hover:shadow-lg hover:shadow-orange-200/50 active:scale-95 disabled:opacity-50 sm:h-8"
                >
                  <FiSend className="h-3.5 w-3.5" />
                  {replyFormProps.isCreating ? '등록 중...' : '답글 등록'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* 대댓글 - 스레드 라인과 연결됨 */}
        {!isCollapsed && hasReplies && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} depth={depth + 1} replyFormProps={replyFormProps} />
            ))}
            {/* 답글 숨기기 버튼 */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-xs text-gray-400 hover:text-orange-500"
            >
              ↑ 답글 숨기기
            </button>
          </div>
        )}

        {/* 접힌 상태 표시 */}
        {isCollapsed && hasReplies && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mt-3 text-xs text-gray-400 hover:text-orange-500"
          >
            ↓ {comment.replies.length}개의 답글 보기
          </button>
        )}
      </div>

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
