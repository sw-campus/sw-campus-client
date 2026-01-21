'use client'

import { useState } from 'react'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { LuGripVertical, LuPlus, LuTrash2 } from 'react-icons/lu'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useAddOptionMutation, useDeleteOptionMutation, useReorderOptionMutation, useUpdateOptionMutation } from '../../hooks/use-survey'
import type { AdminOption, JobTypeCode, QuestionPart } from '../../types/survey.type'
import { JOB_TYPE_LABEL } from '../../types/survey.type'

interface OptionEditorProps {
  questionId: number
  questionSetId: number
  options: AdminOption[]
  part: QuestionPart | null
  isEditable: boolean
}

interface NewOptionForm {
  optionText: string
  score: string
  jobType: JobTypeCode | ''
  isCorrect: boolean
}

const initialNewOption: NewOptionForm = {
  optionText: '',
  score: '',
  jobType: '',
  isCorrect: false,
}

export function OptionEditor({ questionId, questionSetId, options, part, isEditable }: OptionEditorProps) {
  const [newOption, setNewOption] = useState<NewOptionForm>(initialNewOption)
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<NewOptionForm>(initialNewOption)

  const addMutation = useAddOptionMutation()
  const updateMutation = useUpdateOptionMutation()
  const deleteMutation = useDeleteOptionMutation()
  const reorderMutation = useReorderOptionMutation()

  const handleAddOption = () => {
    if (!newOption.optionText.trim()) return

    addMutation.mutate(
      {
        questionId,
        request: {
          optionText: newOption.optionText.trim(),
          score: newOption.score ? parseInt(newOption.score) : undefined,
          jobType: newOption.jobType || undefined,
          isCorrect: newOption.isCorrect || undefined,
        },
      },
      {
        onSuccess: () => setNewOption(initialNewOption),
      },
    )
  }

  const handleStartEdit = (option: AdminOption) => {
    setEditingOptionId(option.optionId)
    setEditForm({
      optionText: option.optionText,
      score: option.score?.toString() || '',
      jobType: option.jobType || '',
      isCorrect: option.isCorrect || false,
    })
  }

  const handleCancelEdit = () => {
    setEditingOptionId(null)
    setEditForm(initialNewOption)
  }

  const handleSaveEdit = (optionId: number) => {
    if (!editForm.optionText.trim()) return

    updateMutation.mutate(
      {
        questionId,
        optionId,
        request: {
          optionText: editForm.optionText.trim(),
          score: editForm.score ? parseInt(editForm.score) : undefined,
          jobType: editForm.jobType || undefined,
          isCorrect: editForm.isCorrect || undefined,
        },
      },
      {
        onSuccess: handleCancelEdit,
      },
    )
  }

  const handleDelete = (optionId: number) => {
    if (confirm('선택지를 삭제하시겠습니까?')) {
      deleteMutation.mutate({ setId: questionSetId, questionId, optionId })
    }
  }

  const handleOptionDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    const draggedOption = options[sourceIndex]
    const newOrder = destinationIndex + 1 // order는 1부터 시작

    reorderMutation.mutate({
      setId: questionSetId,
      questionId,
      optionId: draggedOption.optionId,
      newOrder,
    })
  }

  // Determine which fields to show based on part
  const showScore = part === 'PART2'
  const showJobType = part === 'PART3'
  const showIsCorrect = part === 'PART1'

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium">선택지</Label>
        <p className="text-muted-foreground text-xs">
          {showScore && '점수: 0/5/10점 중 선택'}
          {showJobType && '직무: 프론트엔드/백엔드/데브옵스 중 선택'}
          {showIsCorrect && '정답: 정답인 선택지에 체크'}
          {!showScore && !showJobType && !showIsCorrect && '선택지 텍스트를 입력하세요'}
        </p>
      </div>

      {/* Existing Options */}
      <DragDropContext onDragEnd={handleOptionDragEnd}>
        <Droppable
          droppableId={`options-${questionId}`}
          isDropDisabled={!isEditable}
          renderClone={(provided, snapshot, rubric) => {
            const option = options[rubric.source.index]
            return (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={cn(
                  'bg-background flex items-center gap-2 rounded-md border p-2 shadow-lg',
                  snapshot.isDragging && 'opacity-90'
                )}
              >
                <LuGripVertical className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground w-6 text-sm">{option.optionOrder}.</span>
                <span className="flex-1 text-sm truncate">{option.optionText}</span>
                {showScore && option.score !== null && option.score !== undefined && (
                  <span className="text-muted-foreground text-xs">{option.score}점</span>
                )}
                {showJobType && option.jobType && (
                  <span className="text-muted-foreground text-xs">{JOB_TYPE_LABEL[option.jobType]}</span>
                )}
                {showIsCorrect && option.isCorrect && (
                  <span className="text-xs text-success">정답</span>
                )}
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
              {options.map((option, index) => (
                <Draggable
                  key={option.optionId}
                  draggableId={`option-${option.optionId}`}
                  index={index}
                  isDragDisabled={!isEditable || editingOptionId === option.optionId}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        'bg-muted/30 flex items-center gap-2 rounded-md p-2',
                        snapshot.isDragging && 'opacity-50'
                      )}
                    >
                      {isEditable && editingOptionId !== option.optionId && (
                        <div
                          {...provided.dragHandleProps}
                          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                        >
                          <LuGripVertical className="h-4 w-4" />
                        </div>
                      )}
                      {editingOptionId === option.optionId ? (
                        // Edit mode
                        <>
                          <Input
                            value={editForm.optionText}
                            onChange={e => setEditForm(prev => ({ ...prev, optionText: e.target.value }))}
                            placeholder="선택지 텍스트"
                            className="flex-1"
                          />
                          {showScore && (
                            <Input
                              type="number"
                              value={editForm.score}
                              onChange={e => setEditForm(prev => ({ ...prev, score: e.target.value }))}
                              placeholder="점수"
                              className="w-16"
                            />
                          )}
                          {showJobType && (
                            <Select
                              value={editForm.jobType}
                              onValueChange={(value: JobTypeCode | '') => setEditForm(prev => ({ ...prev, jobType: value }))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="직무" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="F">{JOB_TYPE_LABEL.F}</SelectItem>
                                <SelectItem value="B">{JOB_TYPE_LABEL.B}</SelectItem>
                                <SelectItem value="D">{JOB_TYPE_LABEL.D}</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {showIsCorrect && (
                            <div className="flex items-center gap-1">
                              <Checkbox
                                checked={editForm.isCorrect}
                                onCheckedChange={checked => setEditForm(prev => ({ ...prev, isCorrect: !!checked }))}
                              />
                              <span className="text-xs">정답</span>
                            </div>
                          )}
                          <Button size="sm" onClick={() => handleSaveEdit(option.optionId)} disabled={updateMutation.isPending}>
                            저장
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            취소
                          </Button>
                        </>
                      ) : (
                        // View mode
                        <>
                          <span className="text-muted-foreground w-6 text-sm">{option.optionOrder}.</span>
                          <span className="flex-1 text-sm">{option.optionText}</span>
                          {option.optionValue && (
                            <span className="text-muted-foreground text-xs">({option.optionValue})</span>
                          )}
                          {showScore && option.score !== null && option.score !== undefined && (
                            <span className="text-muted-foreground text-xs">{option.score}점</span>
                          )}
                          {showJobType && option.jobType && (
                            <span className="text-muted-foreground text-xs">{JOB_TYPE_LABEL[option.jobType]}</span>
                          )}
                          {showIsCorrect && option.isCorrect && (
                            <span className="text-xs text-success">정답</span>
                          )}
                          {isEditable && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleStartEdit(option)}>
                                수정
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(option.optionId)}
                                disabled={deleteMutation.isPending}
                              >
                                <LuTrash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add New Option */}
      {isEditable && (
        <div className="flex items-center gap-2">
          <Input
            value={newOption.optionText}
            onChange={e => setNewOption(prev => ({ ...prev, optionText: e.target.value }))}
            placeholder="새 선택지 텍스트"
            className="flex-1"
          />
          {showScore && (
            <Input
              type="number"
              value={newOption.score}
              onChange={e => setNewOption(prev => ({ ...prev, score: e.target.value }))}
              placeholder="점수"
              className="w-16"
            />
          )}
          {showJobType && (
            <Select
              value={newOption.jobType}
              onValueChange={(value: JobTypeCode | '') => setNewOption(prev => ({ ...prev, jobType: value }))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="직무" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F">{JOB_TYPE_LABEL.F}</SelectItem>
                <SelectItem value="B">{JOB_TYPE_LABEL.B}</SelectItem>
                <SelectItem value="D">{JOB_TYPE_LABEL.D}</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showIsCorrect && (
            <div className="flex items-center gap-1">
              <Checkbox
                checked={newOption.isCorrect}
                onCheckedChange={checked => setNewOption(prev => ({ ...prev, isCorrect: !!checked }))}
              />
              <span className="text-xs">정답</span>
            </div>
          )}
          <Button
            size="sm"
            onClick={handleAddOption}
            disabled={addMutation.isPending || !newOption.optionText.trim()}
          >
            <LuPlus className="mr-1 h-4 w-4" />
            추가
          </Button>
        </div>
      )}
    </div>
  )
}
