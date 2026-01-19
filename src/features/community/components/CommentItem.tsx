'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiCornerDownRight, FiEdit2, FiHeart, FiMessageCircle, FiTrash2, FiUser } from 'react-icons/fi'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAuthStore } from '@/store/authStore'

import type { Comment } from '../api/commentApi.types'
import { useDeleteComment, useUpdateComment, useToggleCommentLike } from '../hooks/useComments'

interface CommentItemProps {
  comment: Comment
  postId: number
  onReply?: (parentId: number) => void
  depth?: number
}

const MAX_DEPTH = 3 // 권장: 3단계 (모바일 가독성 고려)

export function CommentItem({ comment, postId, onReply, depth = 0 }: CommentItemProps) {
  const router = useRouter()
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
    router.push('/login')
  }

  const relativeTime = formatRelativeTime(comment.createdAt)

  // 삭제된 댓글 표시
  if (comment.isDeleted) {
    return (
      <div className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-100 pl-4 sm:ml-6 sm:pl-5' : ''}`}>
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
    <div className={`${depth > 0 ? 'ml-4 border-l-2 border-orange-100 pl-4 sm:ml-6 sm:pl-5' : ''}`}>
      <div className="group rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300/80 hover:shadow-md sm:p-5">
        {/* 작성자 정보 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {depth > 0 && <FiCornerDownRight className="h-4 w-4 text-orange-400" />}
            <Link
              href={`/community/user/${comment.authorId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 ring-2 ring-white transition-transform hover:scale-110"
            >
              <FiUser className="h-3.5 w-3.5 text-orange-600" />
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/community/user/${comment.authorId}`}
                className="font-semibold text-gray-800 transition-colors hover:text-orange-600"
              >
                {comment.authorNickname}
              </Link>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400" title={comment.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
              {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">수정됨</span>
              )}
            </div>
          </div>

          {/* 좋아요 */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all hover:bg-rose-50 active:scale-95 ${
              comment.isLiked ? 'bg-rose-50 font-semibold text-rose-500' : 'text-gray-500 hover:text-rose-500'
            }`}
          >
            <FiHeart className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
          </button>
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
          <img src={comment.imageUrl} alt="댓글 이미지" className="mt-4 max-h-48 rounded-xl object-cover" />
        )}

        {/* 액션 버튼 */}
        {isLoggedIn && !isEditing && (
          <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3 text-[13px] opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            {depth < MAX_DEPTH && onReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-gray-500 transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-95"
              >
                <FiMessageCircle className="h-3.5 w-3.5" />
                답글
              </button>
            )}
            {(comment.isAuthor || userType === 'ADMIN') && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 active:scale-95"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                  수정
                </button>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      삭제
                    </button>
                  </AlertDialogTrigger>
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
              </>
            )}
          </div>
        )}
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
