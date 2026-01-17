'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deletePost } from '../api/postApi.client'
import { postKeys } from './usePosts'

/**
 * 게시글 삭제 훅
 */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      toast.success('게시글이 삭제되었습니다.')
    },
    onError: error => {
      toast.error(error.message || '게시글 삭제에 실패했습니다.')
    },
  })
}
