'use client'

import type { RefObject } from 'react'

import type { FormStep } from '@/components/ui/form-stepper'
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
  LectureCreateTeachersFields,
} from '@/features/lecture/components/lecture-create'

export const LECTURE_FORM_STEPS: FormStep[] = [
  { title: '기본 정보', description: '강의명, 카테고리, 커리큘럼' },
  { title: '일정 및 장소', description: '운영 방식, 장소, 요일/시간' },
  { title: '모집 및 비용', description: '선발 절차, 지원 자격, 비용' },
  { title: '옵션 및 환경', description: '취업 지원, 장비, 프로젝트' },
  { title: '강사 및 추가', description: '강사 등록, 추가 제공' },
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

      {/* Step 2: 일정 및 장소 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <LectureCreateLocationFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateScheduleFields />
        </div>
      )}

      {/* Step 3: 모집 및 비용 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <LectureCreateRecruitProcedureFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateQualificationFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateCostFields selectTriggerClassName={selectTriggerClassName} />
        </div>
      )}

      {/* Step 4: 옵션 및 환경 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <LectureCreateOptionsFields />
          <LectureCreateEquipmentFields selectTriggerClassName={selectTriggerClassName} />
          <LectureCreateProjectFields />
        </div>
      )}

      {/* Step 5: 강사 및 추가 정보 */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <LectureCreateTeachersFields />
          <LectureCreateAddsFields />
        </div>
      )}
    </>
  )
}
