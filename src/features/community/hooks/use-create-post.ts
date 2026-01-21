'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createPost } from '../api/post-api.client'
import type { CreatePostRequest, PostDetail } from '../api/post-api.types'
import { postKeys } from './use-posts'

/**
 * 게시글 작성 훅
 */
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation<PostDetail, Error, CreatePostRequest>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success('게시글이 작성되었습니다.')
    },
    onError: error => {
      toast.error(error.message || '게시글 작성에 실패했습니다.')
    },
  })
}
