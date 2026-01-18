'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiCornerDownRight, FiEdit2, FiHeart, FiMessageCircle, FiTrash2, FiUser } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/formatRelativeTime'
import { useAuthStore } from '@/store/authStore'

import type { Comment } from '../api/commentApi.types'
import { useDeleteComment, useUpdateComment } from '../hooks/useComments'

interface CommentItemProps {
  comment: Comment
  postId: number
  onReply?: (parentId: number) => void
  depth?: number
}

const MAX_DEPTH = 2 // 대댓글은 2단계까지만

export function CommentItem({ comment, postId, onReply, depth = 0 }: CommentItemProps) {
  const { isLoggedIn, userType } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(postId)
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId)

  const handleUpdate = () => {
    if (!editBody.trim()) return
    updateComment(
      { commentId: comment.id, request: { body: editBody.trim() } },
      {
        onSuccess: () => setIsEditing(false),
      }
    )
  }

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    deleteComment(comment.id)
  }

  const relativeTime = formatRelativeTime(comment.createdAt)

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-100 pl-3 sm:ml-8 sm:pl-4' : ''}`}>
      <div className="group rounded-lg bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 sm:p-4">
        {/* 작성자 정보 */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {depth > 0 && <FiCornerDownRight className="h-4 w-4 text-gray-400" />}
            <Link
              href={`/community/user/${comment.authorId}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 transition-transform hover:scale-110"
            >
              <FiUser className="h-3.5 w-3.5 text-orange-600" />
            </Link>
            <Link
              href={`/community/user/${comment.authorId}`}
              className="font-medium text-gray-800 transition-colors hover:text-orange-600 hover:underline"
            >
              {comment.authorNickname}
            </Link>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400" title={comment.createdAt.toLocaleString('ko-KR')}>
              {relativeTime}
            </span>
            {comment.createdAt.getTime() !== comment.updatedAt.getTime() && (
              <span className="text-xs text-gray-400">(수정됨)</span>
            )}
          </div>

          {/* 좋아요 */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiHeart className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
          </div>
        </div>

        {/* 본문 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
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
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating || !editBody.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                수정
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-gray-700">{comment.body}</p>
        )}

        {/* 이미지 */}
        {comment.imageUrl && !isEditing && (
          <img
            src={comment.imageUrl}
            alt="댓글 이미지"
            className="mt-3 max-h-48 rounded-lg object-cover"
          />
        )}

        {/* 액션 버튼 - 모바일에서 항상 표시 */}
        {isLoggedIn && !isEditing && (
          <div className="mt-2 flex items-center gap-3 text-sm opacity-100 transition-opacity sm:mt-3 sm:gap-2 sm:text-xs sm:opacity-0 sm:group-hover:opacity-100">
            {depth < MAX_DEPTH && onReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-500 transition-colors active:bg-gray-100 sm:gap-1 sm:px-0 sm:py-0 sm:hover:text-orange-600"
              >
                <FiMessageCircle className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                답글
              </button>
            )}
            {(comment.isAuthor || userType === 'ADMIN') && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-500 transition-colors active:bg-gray-100 sm:gap-1 sm:px-0 sm:py-0 sm:hover:text-orange-600"
                >
                  <FiEdit2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-500 transition-colors active:bg-gray-100 sm:gap-1 sm:px-0 sm:py-0 sm:hover:text-red-600"
                >
                  <FiTrash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 대댓글 */}
      {comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
