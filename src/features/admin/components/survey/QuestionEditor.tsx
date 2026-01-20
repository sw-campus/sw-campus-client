'use client'

import { useState } from 'react'

import { LuChevronDown, LuChevronUp, LuPencil, LuTrash2 } from 'react-icons/lu'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'

import { useDeleteQuestionMutation, useUpdateQuestionMutation } from '../../hooks/useSurvey'
import type { AdminQuestion, QuestionPart, QuestionSetType, QuestionType } from '../../types/survey.type'
import { QUESTION_PART_LABEL, QUESTION_TYPE_LABEL } from '../../types/survey.type'
import { OptionEditor } from './OptionEditor'

interface QuestionEditorProps {
  question: AdminQuestion
  questionSetId: number
  questionSetType: QuestionSetType
  isEditable: boolean
}

interface EditForm {
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  part: QuestionPart | ''
}

export function QuestionEditor({ question, questionSetId, questionSetType, isEditable }: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    questionText: question.questionText,
    questionType: question.questionType,
    isRequired: question.isRequired,
    part: question.part || '',
  })

  const updateMutation = useUpdateQuestionMutation()
  const deleteMutation = useDeleteQuestionMutation()

  const handleStartEdit = () => {
    setIsEditing(true)
    setIsExpanded(true)
    setEditForm({
      questionText: question.questionText,
      questionType: question.questionType,
      isRequired: question.isRequired,
      part: question.part || '',
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    if (!editForm.questionText.trim()) return

    updateMutation.mutate(
      {
        setId: questionSetId,
        questionId: question.questionId,
        request: {
          questionText: editForm.questionText.trim(),
          questionType: editForm.questionType,
          isRequired: editForm.isRequired,
          part: editForm.part || undefined,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    )
  }

  const handleDelete = () => {
    if (confirm('문항을 삭제하시겠습니까? 선택지도 함께 삭제됩니다.')) {
      deleteMutation.mutate({ setId: questionSetId, questionId: question.questionId })
    }
  }

  const showPartSelect = questionSetType === 'APTITUDE'

  return (
    <Card className={cn('transition-all', isExpanded && 'ring-primary/20 ring-2')}>
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <span className="bg-muted text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm font-medium">
            {question.questionOrder}
          </span>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editForm.questionText}
                  onChange={e => setEditForm(prev => ({ ...prev, questionText: e.target.value }))}
                  placeholder="문항 텍스트"
                  rows={2}
                />
                <div className="flex flex-wrap gap-3">
                  <div className="min-w-[120px]">
                    <Label className="text-xs">문항 타입</Label>
                    <Select
                      value={editForm.questionType}
                      onValueChange={(value: QuestionType) => setEditForm(prev => ({ ...prev, questionType: value }))}
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
                        value={editForm.part}
                        onValueChange={(value: QuestionPart | '') => setEditForm(prev => ({ ...prev, part: value }))}
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
                  <div className="min-w-[100px]">
                    <Label className="text-xs">필드 키</Label>
                    <Input
                      value={question.fieldKey || ''}
                      disabled
                      className="bg-muted"
                      title="자동 생성됨"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`required-${question.questionId}`}
                        checked={editForm.isRequired}
                        onCheckedChange={checked => setEditForm(prev => ({ ...prev, isRequired: !!checked }))}
                      />
                      <Label htmlFor={`required-${question.questionId}`} className="text-xs">
                        필수
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? '저장 중...' : '저장'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <p className="text-foreground text-sm font-medium">{question.questionText}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {QUESTION_TYPE_LABEL[question.questionType]}
                  </Badge>
                  {question.part && (
                    <Badge variant="outline" className="text-xs">
                      {QUESTION_PART_LABEL[question.part].split(' - ')[0]}
                    </Badge>
                  )}
                  {question.isRequired && (
                    <Badge variant="secondary" className="text-xs">
                      필수
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-xs">
                    선택지 {question.options.length}개
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isEditable && !isEditing && (
              <>
                <Button size="sm" variant="ghost" onClick={handleStartEdit}>
                  <LuPencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <LuTrash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <LuChevronUp className="h-4 w-4" /> : <LuChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="border-t pt-4">
          <OptionEditor
            questionId={question.questionId}
            questionSetId={questionSetId}
            options={question.options}
            part={question.part}
            isEditable={isEditable}
          />
        </CardContent>
      )}
    </Card>
  )
}
