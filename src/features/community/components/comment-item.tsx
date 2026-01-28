'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  FiEdit2,
  FiHeart,
  FiLoader,
  FiMessageCircle,
  FiMoreHorizontal,
  FiSend,
  FiTrash2,
  FiX,
  FiCornerDownRight,
} from 'react-icons/fi'

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/ui/user-avatar'
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
  isFirst?: boolean
}

const MAX_DEPTH = 3 // 권장: 3단계 (모바일 가독성 고려)

export function CommentItem({ comment, postId, onReply, depth = 0, replyFormProps, isFirst }: CommentItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoggedIn, userType } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  // 댓글 요소 및 인라인 답글 입력폼용 ref
  const commentRef = useRef<HTMLDivElement>(null)
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)
  const isReplyFormVisible = replyFormProps?.replyToId === comment.id

  // 답글 폼이 열리면 자동 포커스
  useEffect(() => {
    if (isReplyFormVisible && replyTextareaRef.current) {
      replyTextareaRef.current.focus()
    }
  }, [isReplyFormVisible])

  // URL 해시로 댓글 스크롤 및 하이라이트
  useEffect(() => {
    const hash = window.location.hash
    const targetId = `comment-${comment.id}`

    if (hash === `#${targetId}` && commentRef.current) {
      // 약간의 지연 후 스크롤 (렌더링 완료 대기)
      const timer = setTimeout(() => {
        commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setIsHighlighted(true)

        // 하이라이트 애니메이션 후 해시 제거 (히스토리 오염 방지)
        const clearTimer = setTimeout(() => {
          setIsHighlighted(false)
          window.history.replaceState(
            null,
            '',
            pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
          )
        }, 2500)

        return () => clearTimeout(clearTimer)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [comment.id, pathname, searchParams])

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
    setIsLikeAnimating(true)
    toggleLike(comment.id)
    setTimeout(() => setIsLikeAnimating(false), 300)
  }

  const handleLoginRedirect = () => {
    setIsLoginDialogOpen(false)
    router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
  }

  const relativeTime = formatRelativeTime(comment.createdAt)

  // 삭제된 댓글 처리
  if (comment.isDeleted) {
    // 대댓글이 없으면 표시하지 않음
    if (comment.replies.length === 0) {
      return null
    }

    // 대댓글이 있으면 "삭제된 댓글입니다" 표시
    return (
      <div
        id={`comment-${comment.id}`}
        className={` ${depth > 0 ? 'ml-4 border-l-2 border-l-gray-200 py-3 pl-4 md:ml-6 md:pl-5' : `py-4 ${!isFirst ? 'border-t border-gray-100' : ''}`} `}
      >
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-gray-200/80" />
          <p className="text-sm text-gray-400 italic">삭제된 댓글입니다</p>
        </div>

        {/* 대댓글 표시 */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-1">
            {comment.replies.map((reply, index) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onReply={onReply}
                depth={depth + 1}
                replyFormProps={replyFormProps}
                isFirst={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={commentRef}
      id={`comment-${comment.id}`}
      className={` ${
        depth > 0
          ? 'ml-4 border-l-2 border-l-gray-200 py-3 pl-4 md:ml-6 md:pl-5'
          : `py-5 ${!isFirst ? 'border-t border-gray-100' : ''}`
      } ${isHighlighted ? 'animate-highlight' : ''} transition-colors duration-200`}
    >
      <div className="group">
        {/* 작성자 정보 + 본문 */}
        <div className="flex gap-3">
          {/* 아바타 */}
          <UserProfileLink
            userId={comment.authorId}
            className="shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <UserAvatar nickname={comment.authorNickname} size="sm" className="shadow-md ring-2 ring-white" />
          </UserProfileLink>

          <div className="min-w-0 flex-1">
            {/* 작성자명 + 시간 */}
            <div className="mb-2 flex items-center gap-2">
              <UserProfileLink
                userId={comment.authorId}
                className="font-semibold text-gray-900 transition-colors hover:text-amber-600"
              >
                {comment.authorNickname}
              </UserProfileLink>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <span title={comment.createdAt.toLocaleString('ko-KR')}>{relativeTime}</span>
                {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
                  <span className="text-gray-300">(수정됨)</span>
                )}
              </span>
            </div>

            {/* 본문 - 대화 버블 스타일 */}
            {isEditing ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-sm focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100">
                  <textarea
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="w-full resize-none border-0 bg-transparent p-4 text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                    rows={3}
                    placeholder="댓글을 수정하세요..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditBody(comment.body)
                    }}
                    className="h-8 rounded-lg px-3 text-xs font-medium"
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isUpdating || !editBody.trim()}
                    className="h-8 gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-600 active:scale-95 disabled:opacity-50"
                  >
                    {isUpdating && <FiLoader className="h-3 w-3 animate-spin" />}
                    수정 완료
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl rounded-tl-md border border-gray-100 bg-linear-to-br from-gray-50/80 to-white px-4 py-3 shadow-sm transition-all duration-200 group-hover:border-gray-200/80 group-hover:shadow-md">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{comment.body}</p>

                {/* 이미지 */}
                {comment.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.imageUrl}
                    alt="댓글 이미지"
                    className="mt-3 max-h-48 rounded-xl object-cover shadow-sm"
                  />
                )}
              </div>
            )}

            {/* 액션 버튼들 */}
            {!isEditing && (
              <div className="mt-2 flex items-center gap-1">
                {/* 좋아요 */}
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`group/like flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                    comment.isLiked
                      ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-rose-500'
                  } `}
                >
                  <FiHeart
                    className={`h-3.5 w-3.5 transition-all duration-200 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover/like:text-rose-400'} ${isLikeAnimating ? 'scale-125' : 'scale-100'} `}
                  />
                  {comment.likeCount > 0 && <span className="tabular-nums">{comment.likeCount}</span>}
                </button>

                {/* 답글 */}
                {isLoggedIn && depth < MAX_DEPTH && onReply && (
                  <button
                    onClick={() => onReply(comment.id)}
                    className="group/reply flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600 active:scale-95"
                  >
                    <FiMessageCircle className="h-3.5 w-3.5 transition-transform group-hover/reply:scale-110" />
                    답글
                  </button>
                )}

                {/* 더보기 메뉴 */}
                {isLoggedIn && (comment.isAuthor || userType === 'ADMIN') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <FiMoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[120px] rounded-xl">
                      <DropdownMenuItem onClick={() => setIsEditing(true)} className="gap-2 rounded-lg text-xs">
                        <FiEdit2 className="h-3.5 w-3.5" />
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="gap-2 rounded-lg text-xs text-rose-600 focus:text-rose-600"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-sm rounded-2xl md:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 md:gap-0">
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600"
              disabled={isDeleting}
            >
              {isDeleting && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 인라인 답글 입력 폼 */}
      {isReplyFormVisible && replyFormProps && (
        <form onSubmit={replyFormProps.onSubmit} className="mt-4 ml-11 md:ml-12">
          <div className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-sm transition-all focus-within:border-amber-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-amber-100">
            {/* 답글 대상 표시 */}
            <div className="flex items-center gap-2 border-b border-amber-100/80 bg-amber-50/50 px-4 py-2">
              <FiCornerDownRight className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">@{comment.authorNickname}에게 답글</span>
            </div>

            <label htmlFor={`reply-input-${comment.id}`} className="sr-only">
              {comment.authorNickname}님에게 답글 작성
            </label>
            <textarea
              id={`reply-input-${comment.id}`}
              ref={replyTextareaRef as React.RefObject<HTMLTextAreaElement>}
              value={replyFormProps.body}
              onChange={e => replyFormProps.setBody(e.target.value)}
              placeholder="답글을 입력하세요..."
              className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              rows={2}
              aria-label={`${comment.authorNickname}님에게 답글`}
            />

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-3 py-2">
              <button
                type="button"
                onClick={replyFormProps.onCancel}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <FiX className="h-3.5 w-3.5" />
                취소
              </button>
              <Button
                type="submit"
                disabled={replyFormProps.isCreating || !replyFormProps.body.trim()}
                size="sm"
                className="h-8 gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-600 active:scale-95 disabled:opacity-50"
              >
                {replyFormProps.isCreating ? (
                  <FiLoader className="h-3 w-3 animate-spin" />
                ) : (
                  <FiSend className="h-3 w-3" />
                )}
                등록
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* 대댓글 */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-1">
          {comment.replies.map((reply, index) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              depth={depth + 1}
              replyFormProps={replyFormProps}
              isFirst={index === 0}
            />
          ))}
        </div>
      )}

      {/* 로그인 필요 다이얼로그 */}
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-sm rounded-2xl md:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>로그인 필요</AlertDialogTitle>
            <AlertDialogDescription>
              좋아요를 누르려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 md:gap-0">
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLoginRedirect}
              className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            >
              로그인하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
