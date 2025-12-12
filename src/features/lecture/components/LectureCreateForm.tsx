'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'

import { DatePicker } from '@/components/common/DatePicker'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { lectureFormSchema, LectureFormValues } from '@/features/lecture/schemas/lectureFormSchema'

export function LectureCreateForm() {
  const { control, handleSubmit, formState, trigger } = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: {
      recruitStart: undefined,
      recruitEnd: undefined,
      lectureStart: undefined,
      lectureEnd: undefined,
    },
  })

  const onSubmit = (values: LectureFormValues) => {
    // TODO: 서버 전송 로직
    console.log('submit', values)
  }

  const { errors, isValid, isSubmitting } = formState

  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>카테고리</FieldLabel>
            <FieldDescription>카테고리를 선택하세요.</FieldDescription>
            <FieldContent>
              <Select defaultValue="backend">
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="frontend">프론트엔드</SelectItem>
                    <SelectItem value="backend">백엔드</SelectItem>
                    <SelectItem value="design">UI/UX & 디자인</SelectItem>
                    <SelectItem value="data">데이터 사이언스</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {/* 강의명 */}
          <Field>
            <FieldLabel>강의명</FieldLabel>
            <FieldContent>
              <Input placeholder="강의명을 입력하세요." />
            </FieldContent>
          </Field>

          {/* 강의 대표 이미지 첨부 */}
          <Field>
            <FieldLabel>대표 이미지 첨부</FieldLabel>
            <FieldDescription>강의 대표 이미지는 한 개만 첨부할 수 있습니다.</FieldDescription>
            <FieldContent>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <input
                    id="banner-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const files = (e.target as HTMLInputElement).files
                      const nameEl = document.getElementById('banner-file-name')
                      if (files && files[0]) {
                        nameEl && (nameEl.textContent = files[0].name)
                      } else {
                        nameEl && (nameEl.textContent = '')
                      }
                    }}
                  />
                  <label htmlFor="banner-file" className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-white">
                    첨부
                  </label>
                  <div id="banner-file-name" className="mt-2 text-sm text-slate-600"></div>
                </div>
              </div>
            </FieldContent>
          </Field>

          {/* 모집 기간 */}
          <Field>
            <FieldLabel>모집기간</FieldLabel>
            <FieldContent>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name="recruitStart"
                  render={({ field }) => (
                    <DatePicker
                      label="시작일"
                      value={field.value ?? undefined}
                      onSelect={d => {
                        field.onChange(d)
                        // re-run validation for these fields so resolver sets errors appropriately
                        trigger(['recruitStart', 'recruitEnd'])
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="recruitEnd"
                  render={({ field }) => (
                    <DatePicker
                      label="종료일"
                      value={field.value ?? undefined}
                      onSelect={async d => {
                        field.onChange(d)
                        await trigger(['recruitStart', 'recruitEnd'])
                      }}
                    />
                  )}
                />
              </div>
              {(errors.recruitStart || errors.recruitEnd) && (
                <FieldDescription className="text-red-600">
                  {errors.recruitStart?.message ?? errors.recruitEnd?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 강의 기간 */}
          <Field>
            <FieldLabel>강의기간</FieldLabel>
            <FieldContent>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name="lectureStart"
                  render={({ field }) => (
                    <DatePicker
                      label="시작일"
                      value={field.value ?? undefined}
                      onSelect={d => {
                        field.onChange(d)
                        trigger(['lectureStart', 'lectureEnd'])
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lectureEnd"
                  render={({ field }) => (
                    <DatePicker
                      label="종료일"
                      value={field.value ?? undefined}
                      onSelect={async d => {
                        field.onChange(d)
                        await trigger(['lectureStart', 'lectureEnd'])
                      }}
                    />
                  )}
                />
              </div>
              {(errors.lectureStart || errors.lectureEnd) && (
                <FieldDescription className="text-red-600">
                  {errors.lectureStart?.message ?? errors.lectureEnd?.message}
                </FieldDescription>
              )}
            </FieldContent>
          </Field>

          {/* 지원자격 */}
          <Field>
            <FieldLabel>지원자격</FieldLabel>
            <FieldContent>
              <Select defaultValue="내일배움카드">
                <SelectTrigger>
                  <SelectValue placeholder="지원자격 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="내일배움카드">내일배움카드 소지자</SelectItem>
                    <SelectItem value="제한없음">제한 없음</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {/* 선발절차 */}
          <Field>
            <FieldLabel>선발절차</FieldLabel>
            <FieldContent>
              <Select defaultValue="코딩테스트">
                <SelectTrigger>
                  <SelectValue placeholder="선발절차 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="코딩테스트">코딩테스트 필요</SelectItem>
                    <SelectItem value="서류심사">서류심사</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {/* 교육비용 */}
          <Field>
            <FieldLabel>교육비용</FieldLabel>
            <FieldContent>
              <Input placeholder="교육비용을 입력하세요." />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>취업 지원 서비스</FieldLabel>
            <FieldContent>
              <Input placeholder="취업 지원 서비스를 입력하세요." />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>강사명</FieldLabel>
            <FieldContent>
              <Input placeholder="강사명을 입력하세요." />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>지원혜택</FieldLabel>
            <FieldContent>
              <Input placeholder="지원 혜택을 입력하세요." />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>훈련시설 및 장비</FieldLabel>
            <FieldContent>
              <div className="flex flex-row items-center gap-2">
                <Input placeholder="훈련시설 및 장비를 입력하세요." />
                <input id="facility-file" type="file" className="hidden" />
                <label htmlFor="facility-file" className="cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-white">
                  첨부
                </label>
              </div>
            </FieldContent>
          </Field>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
            >
              입력
            </button>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
