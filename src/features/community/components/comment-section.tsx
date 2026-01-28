'use client'

import { useRef, useState } from 'react'

import { FiLoader, FiMessageCircle, FiSend, FiCornerDownRight } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

import type { Comment } from '../api/comment-api.types'
import { useComments, useCreateComment } from '../hooks/use-comments'
import { CommentItem } from './comment-item'

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
 * Warm Conversation Flow 디자인
 */
export function CommentSection({ postId }: CommentSectionProps) {
  const { isLoggedIn } = useAuthStore()
  const { data: comments = [], isLoading } = useComments(postId)
  const { mutate: createComment, isPending: isCreating } = useCreateComment()

  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: number } | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
          setIsFocused(false)
        },
      },
    )
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    // 내용이 있으면 포커스 상태 유지
    if (body.trim()) return
    setIsFocused(false)
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
      <section className="mt-14">
        {/* 구분선 with gradient */}
        <div className="via-border mb-10 h-px bg-linear-to-r from-transparent to-transparent" />

        <div className="space-y-8">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-linear-to-br from-amber-100 to-orange-50" />
              <div className="absolute -right-1 -bottom-1 h-5 w-5 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-28 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-4 w-40 animate-pulse rounded-md bg-gray-50" />
            </div>
          </div>

          {/* 입력 폼 스켈레톤 */}
          <div className="h-14 w-full animate-pulse rounded-2xl bg-linear-to-r from-amber-50/50 to-orange-50/30" />

          {/* 댓글 스켈레톤 */}
          <div className="space-y-6 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-linear-to-br from-gray-100 to-gray-50" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 animate-pulse rounded-md bg-gray-100" />
                    <div className="h-3 w-12 animate-pulse rounded-md bg-gray-50" />
                  </div>
                  <div className="rounded-2xl bg-linear-to-br from-gray-50 to-white p-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100/80" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100/60" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-14">
      {/* 구분선 with gradient */}
      <div className="via-border mb-10 h-px bg-linear-to-r from-transparent to-transparent" />

      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 via-orange-50 to-yellow-50 shadow-sm ring-1 ring-amber-200/50">
            <FiMessageCircle className="h-5 w-5 text-amber-600" />
          </div>
          {totalCount > 0 && (
            <span className="absolute -right-1.5 -bottom-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-1.5 text-xs font-bold text-white tabular-nums shadow-md ring-2 ring-white">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">대화에 참여하기</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {totalCount > 0 ? `${totalCount}개의 댓글이 있습니다` : '첫 번째 댓글을 남겨보세요'}
          </p>
        </div>
      </div>

      {/* 새 댓글 입력 폼 (답글 작성 중이 아닐 때만 표시) */}
      {isLoggedIn ? (
        !replyTo && (
          <div className="mb-10">
            <form onSubmit={handleSubmit}>
              <div
                className={`relative overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ease-out ${
                  isFocused
                    ? 'border-amber-300 shadow-lg ring-4 shadow-amber-100/50 ring-amber-50'
                    : 'border-gray-100 hover:border-amber-200/60 hover:shadow-md'
                } `}
              >
                {/* 포커스 상태 배경 그라디언트 */}
                <div
                  className={`absolute inset-0 bg-linear-to-br from-amber-50/40 via-transparent to-orange-50/30 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'} `}
                />

                {/* 접근성을 위한 시각적으로 숨겨진 라벨 */}
                <label htmlFor="comment-input" className="sr-only">
                  댓글 작성
                </label>
                <textarea
                  ref={textareaRef}
                  id="comment-input"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="따뜻한 댓글은 작성자에게 큰 힘이 됩니다..."
                  className={`relative w-full resize-none border-0 bg-transparent px-5 py-4 text-sm leading-relaxed text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-0 focus:outline-none ${isFocused ? 'min-h-[100px]' : 'min-h-[56px]'} `}
                  rows={isFocused ? 3 : 1}
                  aria-label="댓글 내용"
                />

                {/* 액션 영역 */}
                <div
                  className={`relative flex items-center justify-between border-t border-gray-100/80 bg-gray-50/50 px-4 py-2.5 transition-all duration-300 ${isFocused ? 'translate-y-0 opacity-100' : 'h-0 -translate-y-2 overflow-hidden border-t-0 py-0 opacity-0'} `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        Ctrl
                      </kbd>
                      <span className="mx-0.5">+</span>
                      <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        Enter
                      </kbd>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBody('')
                        setIsFocused(false)
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                      취소
                    </button>
                    <Button
                      type="submit"
                      disabled={isCreating || !body.trim()}
                      size="sm"
                      className="h-8 gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 text-xs font-semibold text-white shadow-md shadow-amber-200/50 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-200/60 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                    >
                      {isCreating ? (
                        <FiLoader className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <FiSend className="h-3.5 w-3.5" />
                      )}
                      {isCreating ? '등록 중' : '등록'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className="mb-10 overflow-hidden rounded-2xl border-2 border-dashed border-amber-200/60 bg-linear-to-br from-amber-50/50 via-white to-orange-50/30">
          <div className="flex flex-col items-center justify-center px-8 py-10 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 to-orange-50 shadow-inner">
              <FiCornerDownRight className="h-7 w-7 text-amber-500" />
            </div>
            <p className="text-base font-medium text-gray-700">대화에 참여하고 싶으신가요?</p>
            <p className="mt-2 text-sm text-gray-500">
              댓글을 작성하려면{' '}
              <a
                href="/login"
                className="inline-flex items-center gap-1 font-semibold text-amber-600 underline-offset-2 transition-colors hover:text-amber-700 hover:underline"
              >
                로그인
              </a>
              이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <div className="space-y-1">
          {comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
              replyFormProps={replyFormProps}
              isFirst={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-linear-to-b from-gray-50/30 via-white to-amber-50/20 py-16">
          <div className="relative mb-6">
            {/* 배경 글로우 */}
            <div className="absolute -inset-4 rounded-full bg-linear-to-r from-amber-200/30 to-orange-200/30 blur-xl" />
            <div className="relative rounded-2xl bg-linear-to-br from-amber-100 via-orange-50 to-yellow-50 p-6 shadow-sm ring-1 ring-amber-200/30">
              <HiOutlineSparkles className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-700">아직 대화가 시작되지 않았어요</h3>
          <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-gray-500">
            첫 번째 댓글을 남겨 대화를 시작해보세요.
            <br />
            작성자에게 큰 힘이 됩니다.
          </p>
        </div>
      )}
    </section>
  )
}
