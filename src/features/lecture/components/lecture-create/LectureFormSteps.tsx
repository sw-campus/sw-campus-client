'use client'

import type { RefObject } from 'react'

import type { FormStep } from '@/components/ui/FormStepper'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import {
  LectureCreateAddsFields,
  LectureCreateBasicInfoFields,
  LectureCreateCategoryFields,
  LectureCreateCostFields,
  LectureCreateCurriculumFields,
  LectureCreateEquipmentFields,
  LectureCreateLocationFields,
  LectureCreateOptionsFields,
  LectureCreateProjectFields,
  LectureCreateQualificationFields,
  LectureCreateRecruitProcedureFields,
  LectureCreateScheduleFields,
  LectureCreateSpecialCurriculumFields,
  LectureCreateTeachersFields,
} from '@/features/lecture/components/lecture-create'

export const LECTURE_FORM_STEPS: FormStep[] = [
  { title: '기본정보', description: '강의명, 카테고리' },
  { title: '특화', description: '선택' },
  { title: '일정/장소', description: '운영, 장소' },
  { title: '모집/비용', description: '절차, 자격' },
  { title: '옵션', description: '장비, 프로젝트' },
  { title: '강사', description: '강사, 추가' },
]

type LectureFormStepsProps = {
  currentStep: number
  imageInputRef: RefObject<HTMLInputElement | null>
  selectTriggerClassName: string
  categoryTree?: CategoryTreeNode[]
  categoryId?: number | null
  lectureId?: number | null
}

export function LectureFormSteps({
  currentStep,
  imageInputRef,
  selectTriggerClassName,
  categoryTree,
  categoryId,
  lectureId,
}: LectureFormStepsProps) {
  return (
    <>
      {/* Step 1: 기본 정보 */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <LectureCreateBasicInfoFields imageInputRef={imageInputRef} />
          <LectureCreateCategoryFields
            key={lectureId ? `category-${lectureId}` : 'category-new'}
            selectTriggerClassName={selectTriggerClassName}
            categoryTree={categoryTree}
            categoryId={categoryId}
          />
          <LectureCreateCurriculumFields selectTriggerClassName={selectTriggerClassName} />
        </div>
      )}

      {/* Step 2: 특화 커리큘럼 (선택) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <LectureCreateSpecialCurriculumFields />
        </div>
      )}

      {/* Step 3: 일정 및 장소 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <LectureCreateLocationFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateScheduleFields />
        </div>
      )}

      {/* Step 4: 모집 및 비용 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <LectureCreateRecruitProcedureFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateQualificationFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateCostFields selectTriggerClassName={selectTriggerClassName} />
        </div>
      )}

      {/* Step 5: 옵션 및 환경 */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <LectureCreateOptionsFields />
          <LectureCreateEquipmentFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateProjectFields />
        </div>
      )}

      {/* Step 6: 강사 및 추가 정보 */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <LectureCreateTeachersFields />
          <LectureCreateAddsFields />
        </div>
      )}
    </>
  )
}
