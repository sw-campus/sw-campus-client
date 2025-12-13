'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

import { DatePicker } from '@/components/common/DatePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreateLectureMutation } from '@/features/lecture/hooks/useCreateLectureMutation'
import { lectureFormSchema, LectureFormValues } from '@/features/lecture/schemas/lectureFormSchema'
import type { LectureCreateRequest } from '@/features/lecture/types/lecture-request.type'

const toLocalDateTimeString = (date: Date, hhmm: string) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const safe = hhmm.trim()
  const withSeconds = safe.length === 5 ? `${safe}:00` : safe
  return `${yyyy}-${mm}-${dd}T${withSeconds}`
}

const toLocalDateString = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const toLocalTimeString = (hhmm: string) => {
  const safe = hhmm.trim()
  return safe.length === 5 ? `${safe}:00` : safe
}

export function LectureCreateForm() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateLectureMutation()

  const selectTriggerClassName = 'h-10'

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedRecruit, setSelectedRecruit] = useState<'DOCUMENT' | 'CODING_TEST' | 'INTERVIEW'>('DOCUMENT')
  const [showRecruitDuplicateError, setShowRecruitDuplicateError] = useState(false)

  const toDigitsOnly = (value: string) => value.replace(/\D/g, '')

  const { control, handleSubmit, formState, watch, setValue } = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: {
      lectureName: '',
      lectureLoc: 'ONLINE',
      location: null,
      days: [],
      startTime: '09:00',
      endTime: '18:00',
      recruitProcedures: [{ type: 'DOCUMENT' }],
      recruitType: 'GENERAL',
      subsidy: 0,
      lectureFee: 0,
      eduSubsidy: 0,
      goal: null,
      maxCapacity: null,
      equipPc: null,
      equipMerit: null,
      equipOs: [],
      books: false,
      resume: false,
      mockInterview: false,
      employmentHelp: false,
      afterCompletion: null,
      lectureImageFile: null,
      startAtDate: new Date(),
      endAtDate: new Date(),
      deadlineDate: null,
      totalDays: 1,
      totalTimes: 1,
      projectNum: null,
      projectTime: null,
      projectTeam: null,
      projectTool: null,
      projectMentor: false,
    },
  })

  const {
    fields: recruitFields,
    append: appendRecruit,
    move: moveRecruit,
    remove: removeRecruit,
  } = useFieldArray({
    control,
    name: 'recruitProcedures',
  })

  const onSubmit = async (values: LectureFormValues) => {
    // 현재는 업로드 없이 파일명만 저장(추후 S3 URL로 교체 예정)
    const lectureImageUrl = values.lectureImageFile?.name ?? null

    const toWonString = (manWon: number) => String(manWon * 10_000)

    const osLabelMap: Record<'WINDOWS' | 'MACOS' | 'LINUX', string> = {
      WINDOWS: 'Windows',
      MACOS: 'macOS',
      LINUX: 'Linux',
    }

    const isEquipmentProvided = values.equipPc === 'PC' || values.equipPc === 'LAPTOP'
    const osLine =
      isEquipmentProvided && values.equipOs && values.equipOs.length > 0
        ? `OS: ${values.equipOs.map(v => osLabelMap[v]).join(', ')}`
        : null
    const equipMeritText = values.equipMerit?.trim() ? values.equipMerit.trim() : null
    const equipMeritMerged = [equipMeritText, osLine].filter(Boolean).join('\n')

    const payload: LectureCreateRequest = {
      lectureName: values.lectureName,
      days: values.days,
      startTime: toLocalTimeString(values.startTime),
      endTime: toLocalTimeString(values.endTime),
      lectureLoc: values.lectureLoc,
      location: values.location?.trim() ? values.location.trim() : null,
      recruitType: values.recruitType,
      subsidy: toWonString(values.subsidy),
      lectureFee: toWonString(values.lectureFee),
      eduSubsidy: toWonString(values.eduSubsidy),
      goal: values.goal?.trim() ? values.goal.trim() : null,
      maxCapacity: values.maxCapacity ?? null,
      equipPc: values.equipPc ?? null,
      equipMerit: equipMeritMerged || null,
      books: values.books,
      resume: values.resume,
      mockInterview: values.mockInterview,
      employmentHelp: values.employmentHelp,
      afterCompletion: values.afterCompletion ?? null,
      url: null,
      lectureImageUrl,
      projectNum: values.projectNum ?? null,
      projectTime: values.projectTime ?? null,
      projectTeam: values.projectTeam?.trim() ? values.projectTeam.trim() : null,
      projectTool: values.projectTool?.trim() ? values.projectTool.trim() : null,
      projectMentor: values.projectMentor ?? null,
      startAt: toLocalDateString(values.startAtDate),
      endAt: toLocalDateString(values.endAtDate),
      deadline: values.deadlineDate ? toLocalDateString(values.deadlineDate) : null,
      totalDays: values.totalDays,
      totalTimes: values.totalTimes,
    }

    await mutateAsync(payload)
    router.back()
  }

  const { errors, isValid } = formState
  const lectureLoc = watch('lectureLoc')
  const lectureImageFile = watch('lectureImageFile')
  const recruitProcedures = watch('recruitProcedures')
  const equipPc = watch('equipPc')
  const isPcProvided = equipPc === 'PC' || equipPc === 'LAPTOP'

  const selectedRecruitTypes = new Set((recruitProcedures ?? []).map(p => p.type))
  const isSelectedRecruitAlreadyAdded = selectedRecruitTypes.has(selectedRecruit)

  useEffect(() => {
    if (!isPcProvided) setValue('equipOs', [])
  }, [isPcProvided, setValue])

  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldGroup>
          {/* 강의명 */}
          <Field>
            <FieldLabel>강의명</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="lectureName"
                render={({ field }) => <Input placeholder="강의명을 입력하세요." {...field} />}
              />
              {errors.lectureName && (
                <FieldDescription className="text-red-600">{errors.lectureName.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 총 회차(강의명 아래) */}
          <Field>
            <FieldLabel>총 회차</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="totalTimes"
                render={({ field }) => (
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="예) 24"
                    {...field}
                    value={String(field.value ?? 1)}
                    onChange={e => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
                  />
                )}
              />
              {errors.totalTimes && (
                <FieldDescription className="text-red-600">{errors.totalTimes.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 대표 이미지 업로드 */}
          <Field>
            <FieldLabel>대표 이미지</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="lectureImageFile"
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0] ?? null
                        field.onChange(file)
                      }}
                    />
                    <Button onClick={() => imageInputRef.current?.click()}>업로드</Button>
                    <span className="text-muted-foreground text-sm">
                      {lectureImageFile?.name ?? '선택된 파일 없음'}
                    </span>
                  </div>
                )}
              />
            </FieldContent>
          </Field>

          {/* 강의 유형 + 오프라인 장소(옆으로) */}
          <Field>
            <FieldLabel>강의 장소</FieldLabel>
            <FieldDescription>오프라인/병행 강의인 경우 오프라인 장소를 입력해 주세요.</FieldDescription>
            <FieldContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <Label>강의 유형</Label>
                  <Controller
                    control={control}
                    name="lectureLoc"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                          <SelectValue placeholder="장소 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="ONLINE">온라인</SelectItem>
                            <SelectItem value="OFFLINE">오프라인</SelectItem>
                            <SelectItem value="HYBRID">온/오프라인 병행</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.lectureLoc && (
                    <FieldDescription className="text-red-600">{errors.lectureLoc.message}</FieldDescription>
                  )}
                </div>

                <div className="col-span-2 space-y-1">
                  <Label>오프라인 장소</Label>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <Input
                        placeholder={lectureLoc === 'ONLINE' ? '온라인 강의는 비워도 됩니다.' : '예) 서울 강남구 ...'}
                        {...field}
                        value={field.value ?? ''}
                        disabled={lectureLoc === 'ONLINE'}
                      />
                    )}
                  />
                  {errors.location && (
                    <FieldDescription className="text-red-600">{errors.location.message}</FieldDescription>
                  )}
                </div>
              </div>
            </FieldContent>
          </Field>

          {/* 운영 요일 */}
          <Field>
            <FieldLabel>
              운영 요일<span className="text-red-600">*</span>
            </FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="days"
                render={({ field }) => {
                  const value = field.value ?? []

                  const toggle = (
                    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
                  ) => {
                    const next = value.includes(day) ? value.filter(v => v !== day) : [...value, day]
                    field.onChange(next)
                  }

                  return (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-mon"
                          checked={value.includes('MONDAY')}
                          onCheckedChange={() => toggle('MONDAY')}
                        />
                        <Label htmlFor="day-mon">월</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-tue"
                          checked={value.includes('TUESDAY')}
                          onCheckedChange={() => toggle('TUESDAY')}
                        />
                        <Label htmlFor="day-tue">화</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-wed"
                          checked={value.includes('WEDNESDAY')}
                          onCheckedChange={() => toggle('WEDNESDAY')}
                        />
                        <Label htmlFor="day-wed">수</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-thu"
                          checked={value.includes('THURSDAY')}
                          onCheckedChange={() => toggle('THURSDAY')}
                        />
                        <Label htmlFor="day-thu">목</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-fri"
                          checked={value.includes('FRIDAY')}
                          onCheckedChange={() => toggle('FRIDAY')}
                        />
                        <Label htmlFor="day-fri">금</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-sat"
                          checked={value.includes('SATURDAY')}
                          onCheckedChange={() => toggle('SATURDAY')}
                        />
                        <Label htmlFor="day-sat">토</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="day-sun"
                          checked={value.includes('SUNDAY')}
                          onCheckedChange={() => toggle('SUNDAY')}
                        />
                        <Label htmlFor="day-sun">일</Label>
                      </div>
                    </div>
                  )
                }}
              />
              {errors.days && (
                <FieldDescription className="text-red-600">{String(errors.days.message)}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 정원 */}
          <Field>
            <FieldLabel>
              정원<span className="text-red-600">*</span>
            </FieldLabel>
            <FieldDescription>모집 정원을 입력해 주세요.</FieldDescription>
            <FieldContent>
              <Controller
                control={control}
                name="maxCapacity"
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="예) 30"
                    {...field}
                    value={field.value === null || field.value === undefined ? '' : String(field.value)}
                    onChange={e => {
                      const next = toDigitsOnly(e.target.value)
                      field.onChange(next === '' ? null : Number(next))
                    }}
                  />
                )}
              />
              {errors.maxCapacity && (
                <FieldDescription className="text-red-600">{errors.maxCapacity.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 모집 마감 */}
          <Field>
            <FieldLabel>모집 기간</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="deadlineDate"
                render={({ field }) => (
                  <DatePicker label="모집 마감일" value={field.value ?? undefined} onSelect={field.onChange} />
                )}
              />
              {errors.deadlineDate && (
                <FieldDescription className="text-red-600">{errors.deadlineDate.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 강의 기간 */}
          <Field>
            <FieldLabel>
              강의 기간<span className="text-red-600">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="startAtDate"
                  render={({ field }) => <DatePicker label="시작일" value={field.value} onSelect={field.onChange} />}
                />
                <Controller
                  control={control}
                  name="endAtDate"
                  render={({ field }) => <DatePicker label="종료일" value={field.value} onSelect={field.onChange} />}
                />
              </div>
              {(errors.startAtDate || errors.endAtDate) && (
                <FieldDescription className="text-red-600">
                  {errors.startAtDate?.message ?? errors.endAtDate?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 수업 시간 (LocalTime) */}
          <Field>
            <FieldLabel>수업 시간</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field }) => <Input type="time" aria-label="수업 시작" {...field} />}
                />
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field }) => <Input type="time" aria-label="수업 종료" {...field} />}
                />
              </div>
              {(errors.startTime || errors.endTime) && (
                <FieldDescription className="text-red-600">
                  {errors.startTime?.message ?? errors.endTime?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 선발 절차 (ordered list) */}
          <Field>
            <FieldLabel>선발 절차</FieldLabel>
            <FieldContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedRecruit}
                    onValueChange={v => {
                      setSelectedRecruit(v as typeof selectedRecruit)
                      setShowRecruitDuplicateError(false)
                    }}
                  >
                    <SelectTrigger className={`w-[180px] ${selectTriggerClassName}`}>
                      <SelectValue placeholder="절차 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="DOCUMENT" disabled={selectedRecruitTypes.has('DOCUMENT')}>
                          서류
                        </SelectItem>
                        <SelectItem value="CODING_TEST" disabled={selectedRecruitTypes.has('CODING_TEST')}>
                          코딩테스트
                        </SelectItem>
                        <SelectItem value="INTERVIEW" disabled={selectedRecruitTypes.has('INTERVIEW')}>
                          면접
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedRecruitTypes.has(selectedRecruit)) {
                        setShowRecruitDuplicateError(true)
                        return
                      }
                      appendRecruit({ type: selectedRecruit })
                      setShowRecruitDuplicateError(false)
                    }}
                  >
                    추가
                  </Button>
                </div>

                {showRecruitDuplicateError && isSelectedRecruitAlreadyAdded && (
                  <FieldDescription className="text-red-600">이미 추가된 절차입니다.</FieldDescription>
                )}

                <div className="space-y-2">
                  {recruitFields.map((f, idx) => {
                    const value = f.type
                    const label =
                      value === 'DOCUMENT'
                        ? '서류'
                        : value === 'CODING_TEST'
                          ? '코딩테스트'
                          : value === 'INTERVIEW'
                            ? '면접'
                            : value

                    return (
                      <div
                        key={f.id}
                        className="border-input flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                      >
                        <div className="text-sm">
                          {idx + 1}. {label}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveRecruit(idx, idx - 1)}
                            disabled={idx === 0}
                            aria-label="위로 이동"
                          >
                            <FiChevronUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveRecruit(idx, idx + 1)}
                            disabled={idx === recruitFields.length - 1}
                            aria-label="아래로 이동"
                          >
                            <FiChevronDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeRecruit(idx)}
                            aria-label="삭제"
                          >
                            <FiTrash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {errors.recruitProcedures && (
                  <FieldDescription className="text-red-600">
                    {String(errors.recruitProcedures.message ?? '')}
                  </FieldDescription>
                )}
              </div>
            </FieldContent>
          </Field>

          {/* 내일배움카드 */}
          <Field>
            <FieldLabel>
              내일배움카드<span className="text-red-600">*</span>
            </FieldLabel>
            <FieldDescription>내일배움카드 필요 여부를 선택해 주세요.</FieldDescription>
            <FieldContent>
              <Controller
                control={control}
                name="recruitType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="GENERAL">내일배움카드 불필요</SelectItem>
                        <SelectItem value="CARD_REQUIRED">내일배움카드 필요</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.recruitType && (
                <FieldDescription className="text-red-600">{String(errors.recruitType.message)}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 비용(만원 단위) */}
          <Field>
            <FieldLabel>지원금 / 교육비 / 교육지원금</FieldLabel>
            <FieldDescription>금액은 만원 단위로 입력합니다. (예: 150 = 150만원)</FieldDescription>
            <FieldContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Controller
                  control={control}
                  name="subsidy"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="space-y-0.5">
                        <Label>지원금</Label>
                        <p className="text-muted-foreground text-xs">훈련생에게 지급되는 지원금</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="min-w-0 flex-1"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          {...field}
                          value={String(field.value ?? 0)}
                          onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">만원</span>
                      </div>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="lectureFee"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="space-y-0.5">
                        <Label>교육비</Label>
                        <p className="text-muted-foreground text-xs">훈련 과정 수강 비용</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="min-w-0 flex-1"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          {...field}
                          value={String(field.value ?? 0)}
                          onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">만원</span>
                      </div>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="eduSubsidy"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="space-y-0.5">
                        <Label>교육지원금</Label>
                        <p className="text-muted-foreground text-xs">교육 참여를 위한 추가 지원금</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="min-w-0 flex-1"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          {...field}
                          value={String(field.value ?? 0)}
                          onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                        <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">만원</span>
                      </div>
                    </div>
                  )}
                />
              </div>

              {(errors.subsidy || errors.lectureFee || errors.eduSubsidy) && (
                <FieldDescription className="text-red-600">
                  {errors.subsidy?.message ?? errors.lectureFee?.message ?? errors.eduSubsidy?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>총 교육일수</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="totalDays"
                render={({ field }) => (
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="예) 12"
                    {...field}
                    value={String(field.value ?? 1)}
                    onChange={e => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
                  />
                )}
              />
              {errors.totalDays && (
                <FieldDescription className="text-red-600">{errors.totalDays.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 필수 여부 항목(booleans) */}
          <Field>
            <FieldLabel>제공 항목</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="books"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox id="books" checked={field.value} onCheckedChange={v => field.onChange(v === true)} />
                      <Label htmlFor="books">교재 제공</Label>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="resume"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox id="resume" checked={field.value} onCheckedChange={v => field.onChange(v === true)} />
                      <Label htmlFor="resume">이력서 지원</Label>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="mockInterview"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="mockInterview"
                        checked={field.value}
                        onCheckedChange={v => field.onChange(v === true)}
                      />
                      <Label htmlFor="mockInterview">모의면접 제공</Label>
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="employmentHelp"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="employmentHelp"
                        checked={field.value}
                        onCheckedChange={v => field.onChange(v === true)}
                      />
                      <Label htmlFor="employmentHelp">취업지원 제공</Label>
                    </div>
                  )}
                />
              </div>
            </FieldContent>
          </Field>

          {/* 목표/장비 메리트 (long text) */}
          <Field>
            <FieldLabel>목표</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="goal"
                render={({ field }) => (
                  <Textarea placeholder="강의 목표를 입력해 주세요." {...field} value={field.value ?? ''} />
                )}
              />
            </FieldContent>
          </Field>

          {/* 수료 후 */}
          <Field>
            <FieldLabel>수료 후 지원 기간(개월)</FieldLabel>
            <FieldDescription>선택 항목입니다.</FieldDescription>
            <FieldContent>
              <Controller
                control={control}
                name="afterCompletion"
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="예) 6"
                    {...field}
                    value={field.value === null || field.value === undefined ? '' : String(field.value)}
                    onChange={e => {
                      const next = toDigitsOnly(e.target.value)
                      field.onChange(next === '' ? null : Number(next))
                    }}
                  />
                )}
              />
              {errors.afterCompletion && (
                <FieldDescription className="text-red-600">{errors.afterCompletion.message}</FieldDescription>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>훈련시설/장비 특징</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="equipMerit"
                render={({ field }) => (
                  <Textarea
                    placeholder="예) 최신 GPU PC 제공, 실습실 24시간 개방"
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>훈련 시설(PC)</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>장비</Label>
                  <Controller
                    control={control}
                    name="equipPc"
                    render={({ field }) => (
                      <Select value={field.value ?? ''} onValueChange={v => field.onChange(v || null)}>
                        <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="NONE">없음</SelectItem>
                            <SelectItem value="PC">PC</SelectItem>
                            <SelectItem value="LAPTOP">노트북</SelectItem>
                            <SelectItem value="PERSONAL">개인장비</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.equipPc && (
                    <FieldDescription className="text-red-600">{errors.equipPc.message}</FieldDescription>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className={!isPcProvided ? 'text-muted-foreground' : undefined}>운영체제</Label>
                  <Controller
                    control={control}
                    name="equipOs"
                    render={({ field }) => {
                      const value = field.value ?? []
                      const toggle = (os: 'WINDOWS' | 'MACOS' | 'LINUX') => {
                        const next = value.includes(os) ? value.filter(v => v !== os) : [...value, os]
                        field.onChange(next)
                      }

                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="os-windows"
                              checked={value.includes('WINDOWS')}
                              onCheckedChange={() => toggle('WINDOWS')}
                              disabled={!isPcProvided}
                            />
                            <Label htmlFor="os-windows" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                              Windows
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="os-macos"
                              checked={value.includes('MACOS')}
                              onCheckedChange={() => toggle('MACOS')}
                              disabled={!isPcProvided}
                            />
                            <Label htmlFor="os-macos" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                              macOS
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="os-linux"
                              checked={value.includes('LINUX')}
                              onCheckedChange={() => toggle('LINUX')}
                              disabled={!isPcProvided}
                            />
                            <Label htmlFor="os-linux" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                              Linux
                            </Label>
                          </div>
                        </div>
                      )
                    }}
                  />
                </div>
              </div>
            </FieldContent>
          </Field>

          {/* 프로젝트 */}
          <Field>
            <FieldLabel>프로젝트</FieldLabel>
            <FieldDescription>선택 항목입니다.</FieldDescription>
            <FieldContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="projectNum"
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="프로젝트 개수"
                      {...field}
                      value={field.value === null || field.value === undefined ? '' : String(field.value)}
                      onChange={e => {
                        const next = toDigitsOnly(e.target.value)
                        field.onChange(next === '' ? null : Number(next))
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="projectTime"
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="프로젝트 시간"
                      {...field}
                      value={field.value === null || field.value === undefined ? '' : String(field.value)}
                      onChange={e => {
                        const next = toDigitsOnly(e.target.value)
                        field.onChange(next === '' ? null : Number(next))
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="projectTeam"
                  render={({ field }) => <Input placeholder="프로젝트 팀 구성" {...field} value={field.value ?? ''} />}
                />
                <Controller
                  control={control}
                  name="projectTool"
                  render={({ field }) => <Input placeholder="프로젝트 툴" {...field} value={field.value ?? ''} />}
                />
              </div>

              {(errors.projectNum || errors.projectTime || errors.projectTeam || errors.projectTool) && (
                <FieldDescription className="text-red-600">
                  {errors.projectNum?.message ??
                    errors.projectTime?.message ??
                    errors.projectTeam?.message ??
                    errors.projectTool?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 프로젝트 멘토링 */}
          <Field>
            <FieldLabel>프로젝트 멘토링</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="projectMentor"
                render={({ field }) => (
                  <div className="border-input flex items-center justify-between gap-4 rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">멘토링 제공</div>
                      <div className="text-muted-foreground text-xs">프로젝트 진행 중 멘토링 제공 여부</div>
                    </div>
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </FieldContent>
          </Field>

          <div className="pt-4">
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || isPending}>
              등록
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
