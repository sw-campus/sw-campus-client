import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  QuestionSetType,
  CreateQuestionSetRequest,
  UpdateQuestionSetRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateOptionRequest,
  UpdateOptionRequest,
} from '../types/survey.type'
import {
  fetchQuestionSets,
  fetchQuestionSetDetail,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  publishQuestionSet,
  republishQuestionSet,
  cloneQuestionSet,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  reorderQuestion,
  reorderOption,
} from '../api/surveyApi'

// ===== Query Keys =====
const SURVEY_KEYS = {
  all: ['admin', 'survey'] as const,
  questionSetsList: ['admin', 'survey', 'question-sets'] as const,
  questionSets: (type?: QuestionSetType) => [...SURVEY_KEYS.questionSetsList, type ?? 'ALL'] as const,
  questionSetDetail: (id: number) => [...SURVEY_KEYS.all, 'question-set-detail', id] as const,
}

// ===== QuestionSet Queries =====

export function useQuestionSetsQuery(type?: QuestionSetType) {
  return useQuery({
    queryKey: SURVEY_KEYS.questionSets(type),
    queryFn: () => fetchQuestionSets(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useQuestionSetDetailQuery(id: number) {
  return useQuery({
    queryKey: SURVEY_KEYS.questionSetDetail(id),
    queryFn: () => fetchQuestionSetDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: id > 0,
  })
}

// ===== QuestionSet Mutations =====

export function useCreateQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateQuestionSetRequest) => createQuestionSet(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항 세트가 생성되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 생성에 실패했습니다.')
    },
  })
}

export function useUpdateQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateQuestionSetRequest }) =>
      updateQuestionSet(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항 세트가 수정되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 수정에 실패했습니다.')
    },
  })
}

export function useDeleteQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteQuestionSet(id),
    onSuccess: (_data, deletedId) => {
      // 삭제된 세트의 detail 쿼리를 캐시에서 제거 (refetch 방지)
      queryClient.removeQueries({ queryKey: SURVEY_KEYS.questionSetDetail(deletedId) })
      // 모든 타입의 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.questionSetsList })
      toast.success('문항 세트가 삭제되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 삭제에 실패했습니다.')
    },
  })
}

export function usePublishQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => publishQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항 세트가 발행되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 발행에 실패했습니다.')
    },
  })
}

export function useRepublishQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => republishQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항 세트가 재발행되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 재발행에 실패했습니다.')
    },
  })
}

export function useCloneQuestionSetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cloneQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항 세트가 복제되었습니다.')
    },
    onError: () => {
      toast.error('문항 세트 복제에 실패했습니다.')
    },
  })
}

// ===== Question Mutations =====

export function useAddQuestionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, request }: { setId: number; request: CreateQuestionRequest }) =>
      addQuestion(setId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항이 추가되었습니다.')
    },
    onError: () => {
      toast.error('문항 추가에 실패했습니다.')
    },
  })
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      setId,
      questionId,
      request,
    }: {
      setId: number
      questionId: number
      request: UpdateQuestionRequest
    }) => updateQuestion(setId, questionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('문항이 수정되었습니다.')
    },
    onError: () => {
      toast.error('문항 수정에 실패했습니다.')
    },
  })
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, questionId }: { setId: number; questionId: number }) =>
      deleteQuestion(setId, questionId),
    onSuccess: (_data, { setId }) => {
      // 해당 세트의 detail 쿼리를 즉시 refetch하여 재정렬된 순서 반영
      queryClient.invalidateQueries({
        queryKey: SURVEY_KEYS.questionSetDetail(setId),
        refetchType: 'active',
      })
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.questionSetsList })
      toast.success('문항이 삭제되었습니다.')
    },
    onError: () => {
      toast.error('문항 삭제에 실패했습니다.')
    },
  })
}

// ===== Option Mutations =====

export function useAddOptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ questionId, request }: { questionId: number; request: CreateOptionRequest }) =>
      addOption(questionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('선택지가 추가되었습니다.')
    },
    onError: () => {
      toast.error('선택지 추가에 실패했습니다.')
    },
  })
}

export function useUpdateOptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      optionId,
      request,
    }: {
      questionId: number
      optionId: number
      request: UpdateOptionRequest
    }) => updateOption(questionId, optionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEY_KEYS.all })
      toast.success('선택지가 수정되었습니다.')
    },
    onError: () => {
      toast.error('선택지 수정에 실패했습니다.')
    },
  })
}

export function useDeleteOptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ questionId, optionId }: { setId: number; questionId: number; optionId: number }) =>
      deleteOption(questionId, optionId),
    onSuccess: (_data, { setId }) => {
      // 해당 세트의 detail 쿼리를 즉시 refetch하여 재정렬된 순서 반영
      queryClient.invalidateQueries({
        queryKey: SURVEY_KEYS.questionSetDetail(setId),
        refetchType: 'active',
      })
      toast.success('선택지가 삭제되었습니다.')
    },
    onError: () => {
      toast.error('선택지 삭제에 실패했습니다.')
    },
  })
}

// ===== Reorder Mutations =====

export function useReorderQuestionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, questionId, newOrder }: { setId: number; questionId: number; newOrder: number }) =>
      reorderQuestion(setId, questionId, newOrder),
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries({
        queryKey: SURVEY_KEYS.questionSetDetail(setId),
        refetchType: 'active',
      })
    },
    onError: () => {
      toast.error('문항 순서 변경에 실패했습니다.')
    },
  })
}

export function useReorderOptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, questionId, optionId, newOrder }: { setId: number; questionId: number; optionId: number; newOrder: number }) =>
      reorderOption(questionId, optionId, newOrder),
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries({
        queryKey: SURVEY_KEYS.questionSetDetail(setId),
        refetchType: 'active',
      })
    },
    onError: () => {
      toast.error('선택지 순서 변경에 실패했습니다.')
    },
  })
}
