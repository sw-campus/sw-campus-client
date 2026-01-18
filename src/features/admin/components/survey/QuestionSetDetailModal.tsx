'use client'

import { useState } from 'react'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { LuCopy, LuGripVertical, LuPencil, LuPlus, LuRotateCcw, LuSend, LuTrash2 } from 'react-icons/lu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'

import { fetchQuestionCounts } from '../../api/surveyApi'
import {
  useAddQuestionMutation,
  useCloneQuestionSetMutation,
  useDeleteQuestionSetMutation,
  usePublishQuestionSetMutation,
  useRepublishQuestionSetMutation,
  useQuestionSetDetailQuery,
  useReorderQuestionMutation,
  useUpdateQuestionSetMutation,
} from '../../hooks/useSurvey'
import type { AdminQuestionSet, QuestionPart, QuestionType } from '../../types/survey.type'
import {
  QUESTION_PART_LABEL,
  QUESTION_SET_STATUS_COLOR,
  QUESTION_SET_STATUS_LABEL,
  QUESTION_TYPE_LABEL,
} from '../../types/survey.type'
import { QuestionEditor } from './QuestionEditor'

interface QuestionSetDetailModalProps {
  questionSet: AdminQuestionSet | null
  isOpen: boolean
  onClose: () => void
}

interface NewQuestionForm {
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  part: QuestionPart | ''
}

const initialNewQuestion: NewQuestionForm = {
  questionText: '',
  questionType: 'RADIO',
  isRequired: true,
  part: '',
}

export function QuestionSetDetailModal({ questionSet, isOpen, onClose }: QuestionSetDetailModalProps) {
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState<NewQuestionForm>(initialNewQuestion)

  const { data: detail, isLoading } = useQuestionSetDetailQuery(questionSet?.questionSetId ?? 0)
  const updateMutation = useUpdateQuestionSetMutation()
  const deleteMutation = useDeleteQuestionSetMutation()
  const publishMutation = usePublishQuestionSetMutation()
  const republishMutation = useRepublishQuestionSetMutation()
  const cloneMutation = useCloneQuestionSetMutation()
  const addQuestionMutation = useAddQuestionMutation()
  const reorderQuestionMutation = useReorderQuestionMutation()

  if (!questionSet) return null

  const isEditable = questionSet.status === 'DRAFT'
  const isArchived = questionSet.status === 'ARCHIVED'
  const isDeletable = isEditable || isArchived
  const showPartSelect = questionSet.type === 'APTITUDE'

  const handleStartEditInfo = () => {
    setEditName(questionSet.name)
    setEditDescription(questionSet.description || '')
    setIsEditingInfo(true)
  }

  const handleCancelEditInfo = () => {
    setIsEditingInfo(false)
  }

  const handleSaveInfo = () => {
    if (!editName.trim()) return

    updateMutation.mutate(
      {
        id: questionSet.questionSetId,
        request: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        },
      },
      {
        onSuccess: () => setIsEditingInfo(false),
      },
    )
  }

  const handleDelete = () => {
    if (confirm('문항 세트를 삭제하시겠습니까? 모든 문항과 선택지도 함께 삭제됩니다.')) {
      deleteMutation.mutate(questionSet.questionSetId, {
        onSuccess: onClose,
      })
    }
  }

  const handlePublish = async () => {
    const DEFAULT_CONFIRM_MESSAGE = '문항 세트를 발행하시겠습니까? 발행 후에는 수정이 불가능합니다.'

    // APTITUDE 타입일 때 Part3 문항 수 확인하여 경고 메시지 결정
    let confirmMessage = DEFAULT_CONFIRM_MESSAGE

    if (questionSet.type === 'APTITUDE') {
      try {
        const counts = await fetchQuestionCounts(questionSet.questionSetId)
        const part3Count = counts.PART3 || 0

        if (part3Count < 5) {
          confirmMessage = `Part 3 문항이 ${part3Count}개입니다. 5개 미만이면 추천 직무 정확도가 낮아질 수 있습니다.\n\n계속 발행하시겠습니까?`
        }
      } catch {
        // 문항 수 조회 실패 시 기본 확인 메시지 사용
      }
    }

    if (!confirm(confirmMessage)) {
      return
    }

    publishMutation.mutate(questionSet.questionSetId, {
      onSuccess: onClose,
    })
  }

  const handleClone = () => {
    if (confirm('문항 세트를 복제하시겠습니까? 새 버전이 DRAFT 상태로 생성됩니다.')) {
      cloneMutation.mutate(questionSet.questionSetId, {
        onSuccess: onClose,
      })
    }
  }

  const handleRepublish = () => {
    if (confirm('이 문항 세트를 다시 발행하시겠습니까? 현재 발행된 세트는 보관됩니다.')) {
      republishMutation.mutate(questionSet.questionSetId, {
        onSuccess: onClose,
      })
    }
  }

  const handleAddQuestion = () => {
    if (!newQuestion.questionText.trim()) return

    addQuestionMutation.mutate(
      {
        setId: questionSet.questionSetId,
        request: {
          questionText: newQuestion.questionText.trim(),
          questionType: newQuestion.questionType,
          isRequired: newQuestion.isRequired,
          part: newQuestion.part || undefined,
        },
      },
      {
        onSuccess: () => {
          setNewQuestion(initialNewQuestion)
          setShowAddQuestion(false)
        },
      },
    )
  }

  const handleQuestionDragEnd = (result: DropResult) => {
    if (!result.destination || !detail?.questions) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    const draggedQuestion = detail.questions[sourceIndex]
    const newOrder = destinationIndex + 1 // order는 1부터 시작

    reorderQuestionMutation.mutate({
      setId: questionSet.questionSetId,
      questionId: draggedQuestion.questionId,
      newOrder,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {isEditingInfo ? (
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="max-w-xs"
                  />
                ) : (
                  questionSet.name
                )}
              </DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-2">
                <Badge className={cn(QUESTION_SET_STATUS_COLOR[questionSet.status])}>
                  {QUESTION_SET_STATUS_LABEL[questionSet.status]}
                </Badge>
                <span>v{questionSet.version}</span>
                <span>· 생성일: {formatDate(questionSet.createdAt)}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <Label className="text-sm font-medium">설명</Label>
            {isEditingInfo ? (
              <Textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="설명 (선택사항)"
                rows={2}
                className="mt-1"
              />
            ) : (
              <p className="text-muted-foreground mt-1 text-sm">
                {questionSet.description || '(설명 없음)'}
              </p>
            )}
          </div>

          {/* Edit Info Buttons */}
          {isEditable && (
            <div className="flex gap-2">
              {isEditingInfo ? (
                <>
                  <Button size="sm" onClick={handleSaveInfo} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? '저장 중...' : '저장'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEditInfo}>
                    취소
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={handleStartEditInfo}>
                  <LuPencil className="mr-1 h-4 w-4" />
                  정보 수정
                </Button>
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">문항 목록</Label>
              {isEditable && (
                <Button size="sm" variant="outline" onClick={() => setShowAddQuestion(!showAddQuestion)}>
                  <LuPlus className="mr-1 h-4 w-4" />
                  문항 추가
                </Button>
              )}
            </div>

            {/* Add Question Form */}
            {showAddQuestion && (
              <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                <Textarea
                  value={newQuestion.questionText}
                  onChange={e => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                  placeholder="문항 텍스트를 입력하세요"
                  rows={2}
                />
                <div className="flex flex-wrap gap-3">
                  <div className="min-w-[120px]">
                    <Label className="text-xs">문항 타입</Label>
                    <Select
                      value={newQuestion.questionType}
                      onValueChange={(value: QuestionType) =>
                        setNewQuestion(prev => ({ ...prev, questionType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(QUESTION_TYPE_LABEL).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {showPartSelect && (
                    <div className="min-w-[180px]">
                      <Label className="text-xs">파트</Label>
                      <Select
                        value={newQuestion.part}
                        onValueChange={(value: QuestionPart | '') =>
                          setNewQuestion(prev => ({ ...prev, part: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(QUESTION_PART_LABEL).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  * 필드 키는 q1, q2, q3... 형식으로 자동 생성됩니다.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddQuestion}
                    disabled={addQuestionMutation.isPending || !newQuestion.questionText.trim()}
                  >
                    {addQuestionMutation.isPending ? '추가 중...' : '추가'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddQuestion(false)}>
                    취소
                  </Button>
                </div>
              </div>
            )}

            {/* Question List */}
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <span className="text-muted-foreground">로딩 중...</span>
              </div>
            ) : detail?.questions && detail.questions.length > 0 ? (
              <DragDropContext onDragEnd={handleQuestionDragEnd}>
                <Droppable
                  droppableId="questions"
                  isDropDisabled={!isEditable}
                  renderClone={(provided, snapshot, rubric) => {
                    const question = detail.questions[rubric.source.index]
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          'bg-background rounded-lg border shadow-lg',
                          snapshot.isDragging && 'opacity-90'
                        )}
                      >
                        <div className="flex items-start gap-2 p-2">
                          <div className="text-muted-foreground mt-1">
                            <LuGripVertical className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              Q{question.questionOrder}. {question.questionText}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {QUESTION_TYPE_LABEL[question.questionType]}
                              {question.part && ` · ${QUESTION_PART_LABEL[question.part]}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {detail.questions.map((question, index) => (
                        <Draggable
                          key={question.questionId}
                          draggableId={`question-${question.questionId}`}
                          index={index}
                          isDragDisabled={!isEditable}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                'transition-all',
                                snapshot.isDragging && 'opacity-50'
                              )}
                            >
                              <div className="flex items-start gap-2">
                                {isEditable && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-muted-foreground hover:text-foreground mt-3 cursor-grab active:cursor-grabbing"
                                  >
                                    <LuGripVertical className="h-5 w-5" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <QuestionEditor
                                    question={question}
                                    questionSetId={questionSet.questionSetId}
                                    questionSetType={questionSet.type}
                                    isEditable={isEditable}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <span className="text-muted-foreground">문항이 없습니다. 문항을 추가해주세요.</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 gap-2">
            <Button variant="outline" onClick={handleClone} disabled={cloneMutation.isPending}>
              <LuCopy className="mr-1 h-4 w-4" />
              복제
            </Button>
            {isArchived && (
              <Button onClick={handleRepublish} disabled={republishMutation.isPending}>
                <LuRotateCcw className="mr-1 h-4 w-4" />
                재발행
              </Button>
            )}
            {isEditable && (
              <Button onClick={handlePublish} disabled={publishMutation.isPending}>
                <LuSend className="mr-1 h-4 w-4" />
                발행
              </Button>
            )}
            {isDeletable && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <LuTrash2 className="mr-1 h-4 w-4" />
                삭제
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
