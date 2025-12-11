'use client'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const deliveryModes = [
  { value: 'online', label: '온라인' },
  { value: 'offline', label: '오프라인' },
  { value: 'hybrid', label: '온/오프라인 병행' },
]

const categories = [
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'design', label: 'UI/UX & 디자인' },
  { value: 'data', label: '데이터 사이언스' },
]

const difficultyLevels = [
  { value: 'basic', label: '입문' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const textareaClassName =
  'min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-relaxed text-foreground shadow-xs transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

export function CourseRegistrationForm() {
  return (
    <div className="space-y-6">
      <FieldSet>
        <FieldLegend>기본 정보</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>교육과정명</FieldLabel>
            <FieldDescription>등록된 교육과정은 내부 심사 후 리스트에 반영됩니다.</FieldDescription>
            <FieldContent>
              <Input placeholder="예: 실무형 프론트엔드 마스터 과정" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>교육형태</FieldLabel>
            <FieldDescription>온라인, 오프라인, 또는 혼합 형태로 설정하세요.</FieldDescription>
            <FieldContent>
              <Select defaultValue="online">
                <SelectTrigger>
                  <SelectValue placeholder="교육형태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {deliveryModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>카테고리</FieldLabel>
            <FieldDescription>조직 내 분류에 맞게 카테고리를 지정하세요.</FieldDescription>
            <FieldContent>
              <Select defaultValue="frontend">
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>교육 기간 (주)</FieldLabel>
            <FieldDescription>총 진행 주수를 숫자로 입력하세요.</FieldDescription>
            <FieldContent>
              <Input type="number" min={1} step={1} placeholder="예: 8" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>모집 인원</FieldLabel>
            <FieldDescription>세션 별 최대 인원을 설정합니다.</FieldDescription>
            <FieldContent>
              <Input type="number" min={1} step={1} placeholder="예: 30" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>시작 예정일</FieldLabel>
            <FieldDescription>최초 오픈 예정일을 기준으로 입력하세요.</FieldDescription>
            <FieldContent>
              <Input type="date" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>상세 안내</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>난이도</FieldLabel>
            <FieldDescription>과정 난이도를 명확히 표시해 주세요.</FieldDescription>
            <FieldContent>
              <Select defaultValue="intermediate">
                <SelectTrigger>
                  <SelectValue placeholder="난이도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>대상</FieldLabel>
            <FieldDescription>예: 1~2년차 프론트엔드 개발자</FieldDescription>
            <FieldContent>
              <Input placeholder="대상 그룹을 입력하세요." />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>과정 소개</FieldLabel>
            <FieldDescription>간단한 한 줄 개요와 기대 효과를 작성하세요.</FieldDescription>
            <FieldContent>
              <textarea className={textareaClassName} placeholder="교육 내용과 목표를 서술하세요." />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
