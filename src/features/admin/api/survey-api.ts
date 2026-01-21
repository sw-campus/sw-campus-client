import { api } from '@/lib/axios'
import type {
  AdminQuestionSet,
  AdminQuestionSetDetail,
  AdminQuestion,
  AdminOption,
  QuestionSetType,
  CreateQuestionSetRequest,
  UpdateQuestionSetRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateOptionRequest,
  UpdateOptionRequest,
} from '../types/survey.type'

const BASE_URL = '/admin/survey/question-sets'

// ===== QuestionSet API =====

export async function fetchQuestionSets(type?: QuestionSetType): Promise<AdminQuestionSet[]> {
  const { data } = await api.get<AdminQuestionSet[]>(BASE_URL, {
    params: type ? { type } : undefined,
  })
  return data
}

export async function fetchQuestionSetDetail(id: number): Promise<AdminQuestionSetDetail> {
  const { data } = await api.get<AdminQuestionSetDetail>(`${BASE_URL}/${id}`)
  return data
}

export type QuestionCountsByPart = Record<'PART1' | 'PART2' | 'PART3', number>

export async function fetchQuestionCounts(id: number): Promise<QuestionCountsByPart> {
  const { data } = await api.get<QuestionCountsByPart>(`${BASE_URL}/${id}/question-counts`)
  return data
}

export async function createQuestionSet(request: CreateQuestionSetRequest): Promise<AdminQuestionSet> {
  const { data } = await api.post<AdminQuestionSet>(BASE_URL, request)
  return data
}

export async function updateQuestionSet(id: number, request: UpdateQuestionSetRequest): Promise<AdminQuestionSet> {
  const { data } = await api.put<AdminQuestionSet>(`${BASE_URL}/${id}`, request)
  return data
}

export async function deleteQuestionSet(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`)
}

export async function publishQuestionSet(id: number): Promise<AdminQuestionSet> {
  const { data } = await api.post<AdminQuestionSet>(`${BASE_URL}/${id}/publish`)
  return data
}

export async function republishQuestionSet(id: number): Promise<AdminQuestionSet> {
  const { data } = await api.post<AdminQuestionSet>(`${BASE_URL}/${id}/republish`)
  return data
}

export async function cloneQuestionSet(id: number): Promise<AdminQuestionSet> {
  const { data } = await api.post<AdminQuestionSet>(`${BASE_URL}/${id}/clone`)
  return data
}

// ===== Question API =====

export async function addQuestion(setId: number, request: CreateQuestionRequest): Promise<AdminQuestion> {
  const { data } = await api.post<AdminQuestion>(`${BASE_URL}/${setId}/questions`, request)
  return data
}

export async function updateQuestion(
  setId: number,
  questionId: number,
  request: UpdateQuestionRequest,
): Promise<AdminQuestion> {
  const { data } = await api.put<AdminQuestion>(`${BASE_URL}/${setId}/questions/${questionId}`, request)
  return data
}

export async function deleteQuestion(setId: number, questionId: number): Promise<void> {
  await api.delete(`${BASE_URL}/${setId}/questions/${questionId}`)
}

// ===== Option API =====

export async function addOption(questionId: number, request: CreateOptionRequest): Promise<AdminOption> {
  const { data } = await api.post<AdminOption>(`${BASE_URL}/questions/${questionId}/options`, request)
  return data
}

export async function updateOption(
  questionId: number,
  optionId: number,
  request: UpdateOptionRequest,
): Promise<AdminOption> {
  const { data } = await api.put<AdminOption>(`${BASE_URL}/questions/${questionId}/options/${optionId}`, request)
  return data
}

export async function deleteOption(questionId: number, optionId: number): Promise<void> {
  await api.delete(`${BASE_URL}/questions/${questionId}/options/${optionId}`)
}

// ===== Reorder API =====

export async function reorderQuestion(setId: number, questionId: number, newOrder: number): Promise<void> {
  await api.put(`${BASE_URL}/${setId}/questions/${questionId}/order`, { newOrder })
}

export async function reorderOption(questionId: number, optionId: number, newOrder: number): Promise<void> {
  await api.put(`${BASE_URL}/questions/${questionId}/options/${optionId}/order`, { newOrder })
}
