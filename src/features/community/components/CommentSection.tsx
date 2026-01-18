'use client'

import { useRef, useState } from 'react'
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

import { useComments, useCreateComment } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import type { Comment } from '../api/commentApi.types'

interface CommentSectionProps {
  postId: number
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { isLoggedIn } = useAuthStore()
  const { data: comments = [], isLoading } = useComments(postId)
  const { mutate: createComment, isPending: isCreating } = useCreateComment()

  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: number; nickname?: string } | null>(null)
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
        },
      }
    )
  }

  const handleReply = (parentId: number) => {
    // 부모 댓글 찾기
    const findComment = (list: Comment[], id: number): Comment | undefined => {
      for (const comment of list) {
        if (comment.id === id) return comment
        const found = findComment(comment.replies, id)
        if (found) return found
      }
      return undefined
    }

    const parent = findComment(comments, parentId)
    setReplyTo({ id: parentId, nickname: parent?.authorNickname })
    textareaRef.current?.focus()
  }

  // 댓글 총 개수 (대댓글 포함)
  const getTotalCount = (list: Comment[]): number => {
    return list.reduce((acc: number, comment: Comment) => acc + 1 + getTotalCount(comment.replies), 0)
  }

  const totalCount = getTotalCount(comments)

  if (isLoading) {
    return (
      <section className="mt-8 border-t border-gray-100 pt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-24 w-full rounded bg-gray-200" />
        </div>
      </section>
    )
  }

  return (
    <section className="mt-8 border-t border-gray-100 pt-8">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-2">
        <FiMessageCircle className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          댓글 {totalCount > 0 && <span className="text-orange-500">{totalCount}</span>}
        </h2>
      </div>

      {/* 댓글 입력 폼 */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          {/* 대댓글 표시 */}
          {replyTo && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
              <span>@{replyTo.nickname}에게 답글 작성 중</span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="ml-auto rounded-full p-1 hover:bg-orange-100 active:bg-orange-200"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
              className="min-h-[80px] flex-1 resize-none rounded-lg border border-gray-200 p-3 text-sm transition-all focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100 sm:min-h-0"
              rows={3}
            />
            <Button
              type="submit"
              disabled={isCreating || !body.trim()}
              className="h-11 w-full gap-2 bg-orange-500 active:scale-[0.98] hover:bg-orange-600 sm:h-auto sm:w-auto sm:self-end"
            >
              <FiSend className="h-4 w-4" />
              등록
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          댓글을 작성하려면{' '}
          <a href="/login" className="font-medium text-orange-500 hover:underline">
            로그인
          </a>
          이 필요합니다.
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
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <FiMessageCircle className="mx-auto mb-2 h-8 w-8" />
          <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        </div>
      )}
    </section>
  )
}
