import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createTestData, deleteTestData, fetchTestDataSummary } from '../api/testDataApi'

/**
 * 테스트 데이터 현황 조회 Query Hook
 */
export function useTestDataSummaryQuery() {
  return useQuery({
    queryKey: ['admin', 'testData', 'summary'],
    queryFn: fetchTestDataSummary,
  })
}

/**
 * 테스트 데이터 생성 Mutation Hook
 */
export function useCreateTestDataMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTestData,
    onSuccess: data => {
      toast.success(`테스트 데이터 생성 완료 (총 ${data.totalCount}건)`)
      queryClient.invalidateQueries({ queryKey: ['admin', 'testData'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || '테스트 데이터 생성 실패')
    },
  })
}

/**
 * 테스트 데이터 삭제 Mutation Hook
 */
export function useDeleteTestDataMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTestData,
    onSuccess: () => {
      toast.success('테스트 데이터 삭제 완료')
      queryClient.invalidateQueries({ queryKey: ['admin', 'testData'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || '테스트 데이터 삭제 실패')
    },
  })
}
