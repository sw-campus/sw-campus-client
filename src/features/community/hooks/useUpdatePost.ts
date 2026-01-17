'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updatePost } from '../api/postApi.client'
import type { PostDetail, UpdatePostRequest } from '../api/postApi.types'
import { postKeys } from './usePosts'

interface UpdatePostParams {
  postId: number
  data: UpdatePostRequest
}

/**
 * 게시글 수정 훅
 */
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation<PostDetail, Error, UpdatePostParams>({
    mutationFn: ({ postId, data }) => updatePost(postId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) })
      toast.success('게시글이 수정되었습니다.')
    },
    onError: error => {
      toast.error(error.message || '게시글 수정에 실패했습니다.')
    },
  })
}
