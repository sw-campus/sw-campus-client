'use client'

import { useState } from 'react'
import { FiLoader, FiMessageCircle, FiSend, FiSmile } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

import { useComments, useCreateComment } from '../hooks/use-comments'
import { CommentItem } from './comment-item'
import type { Comment } from '../api/comment-api.types'

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

/**
 * 댓글 섹션 컴포넌트
 */
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
      <section className="mt-12 border-t border-gray-100 pt-10">
        <div className="space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50" />
            <div className="h-6 w-24 rounded-lg bg-gray-100" />
          </div>
          {/* 입력 폼 스켈레톤 */}
          <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50" />
          {/* 댓글 스켈레톤 */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-20 w-full rounded-xl bg-gray-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-12 border-t border-gray-100 pt-10">
      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-sm">
          <FiMessageCircle className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            댓글
            {totalCount > 0 && (
              <span className="ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 text-sm font-bold tabular-nums text-white shadow-sm">
                {totalCount}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">자유롭게 의견을 나눠보세요</p>
        </div>
      </div>

      {/* 새 댓글 입력 폼 (답글 작성 중이 아닐 때만 표시) */}
      {isLoggedIn ? (
        !replyTo && (
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 focus-within:border-orange-300/80 focus-within:shadow-lg focus-within:shadow-orange-100/40">
              {/* 접근성을 위한 시각적으로 숨겨진 라벨 */}
              <label htmlFor="comment-input" className="sr-only">
                댓글 작성
              </label>
              <textarea
                id="comment-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="따뜻한 댓글은 작성자에게 큰 힘이 됩니다..."
                className="min-h-[100px] w-full resize-none border-0 bg-transparent p-5 text-sm leading-relaxed text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-0 md:min-h-[120px]"
                rows={4}
                aria-label="댓글 내용"
              />
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                <p className="hidden text-xs text-gray-400 md:block">
                  Ctrl + Enter로 등록
                </p>
                <Button
                  type="submit"
                  disabled={isCreating || !body.trim()}
                  className="h-10 gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-bold shadow-md shadow-orange-200/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200/60 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isCreating ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiSend className="h-4 w-4" />
                  )}
                  {isCreating ? '등록 중...' : '댓글 등록'}
                </Button>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="mb-10 rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-white p-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50">
            <FiMessageCircle className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600">
            댓글을 작성하려면{' '}
            <a href="/login" className="font-bold text-orange-500 underline-offset-2 transition-colors hover:text-orange-600 hover:underline">
              로그인
            </a>
            이 필요합니다.
          </p>
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <div className="space-y-5">
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
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/30 to-white py-20">
          <div className="relative mb-5">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-orange-100/40 to-amber-100/40 blur-lg" />
            <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-5 shadow-sm">
              <FiSmile className="h-10 w-10 text-gray-300" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-600">아직 댓글이 없습니다</h3>
          <p className="mt-2 text-center text-sm text-gray-400">
            첫 번째 댓글을 남겨주세요!<br />
            작성자에게 큰 힘이 됩니다.
          </p>
        </div>
      )}
    </section>
  )
}
