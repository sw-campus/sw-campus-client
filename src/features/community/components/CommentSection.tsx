'use client'

import { useState } from 'react'
import { FiMessageCircle, FiSend } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

import { useComments, useCreateComment } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import type { Comment } from '../api/commentApi.types'

interface CommentSectionProps {
  postId: number
}

export interface ReplyFormProps {
  replyToId: number | null
  body: string
  setBody: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isCreating: boolean
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { isLoggedIn } = useAuthStore()
  const { data: comments = [], isLoading } = useComments(postId)
  const { mutate: createComment, isPending: isCreating } = useCreateComment()

  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: number } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    createComment(
      {
        postId,
        parentId: replyTo?.id ?? null,
        body: body.trim(),
      },
      {
        onSuccess: () => {
          setBody('')
          setReplyTo(null)
        },
      }
    )
  }

  const handleReply = (parentId: number) => {
    setReplyTo({ id: parentId })
    setBody('')
  }

  const handleCancelReply = () => {
    setReplyTo(null)
    setBody('')
  }

  const replyFormProps: ReplyFormProps = {
    replyToId: replyTo?.id ?? null,
    body,
    setBody,
    onSubmit: handleSubmit,
    onCancel: handleCancelReply,
    isCreating,
  }

  // 댓글 총 개수 (대댓글 포함, 삭제된 댓글 제외)
  const getTotalCount = (list: Comment[]): number => {
    return list.reduce((acc: number, comment: Comment) => {
      const current = comment.isDeleted ? 0 : 1
      return acc + current + getTotalCount(comment.replies)
    }, 0)
  }

  const totalCount = getTotalCount(comments)

  if (isLoading) {
    return (
      <section className="mt-10 border-t border-gray-100 pt-10">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gray-100" />
            <div className="h-5 w-20 rounded-lg bg-gray-100" />
          </div>
          <div className="h-28 w-full rounded-2xl bg-gray-50" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 w-full rounded-2xl bg-gray-50" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10 border-t border-gray-100 pt-10">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
          <FiMessageCircle className="h-4 w-4 text-orange-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          댓글
          {totalCount > 0 && (
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 text-sm font-semibold text-white">
              {totalCount}
            </span>
          )}
        </h2>
      </div>

      {/* 새 댓글 입력 폼 (답글 작성 중이 아닐 때만 표시) */}
      {isLoggedIn ? (
        !replyTo && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow focus-within:border-orange-300 focus-within:shadow-lg focus-within:shadow-orange-100/50">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="min-h-[80px] w-full resize-none border-0 bg-transparent p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:min-h-[100px]"
                rows={3}
              />
              <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50/50 px-3 py-2">
                <Button
                  type="submit"
                  disabled={isCreating || !body.trim()}
                  className="h-10 gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-semibold shadow-md shadow-orange-200/50 transition-all hover:shadow-lg hover:shadow-orange-200/50 active:scale-95 disabled:opacity-50 sm:h-9"
                >
                  <FiSend className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  {isCreating ? '등록 중...' : '등록'}
                </Button>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/50 to-white p-6 text-center">
          <p className="text-sm text-gray-500">
            댓글을 작성하려면{' '}
            <a href="/login" className="font-semibold text-orange-500 underline-offset-2 hover:underline">
              로그인
            </a>
            이 필요합니다.
          </p>
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
              replyFormProps={replyFormProps}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/30 to-white py-16">
          <div className="mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-4">
            <FiMessageCircle className="h-7 w-7 text-gray-300" />
          </div>
          <p className="font-medium text-gray-500">아직 댓글이 없습니다</p>
          <p className="mt-1 text-sm text-gray-400">첫 댓글을 작성해보세요!</p>
        </div>
      )}
    </section>
  )
}
