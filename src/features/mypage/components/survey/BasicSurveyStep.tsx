'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { SURVEY_MESSAGES } from '../../constants/surveyMessages'
import { useSaveBasicSurveyMutation } from '../../hooks/useSurvey'
import type {
  BasicSurveyResponse,
  BudgetRange,
  DesiredJob,
  LearningMethod,
} from '../../types/survey.type'
import {
  BUDGET_RANGE_LABELS,
  DESIRED_JOB_LABELS,
  LEARNING_METHOD_LABELS,
} from '../../types/survey.type'
import { basicSurveySchema, type BasicSurveyFormValues } from '../../validation/survey.schema'

interface BasicSurveyStepProps {
  existingData?: BasicSurveyResponse | null
  onComplete: () => void
}

export function BasicSurveyStep({ existingData, onComplete }: BasicSurveyStepProps) {
  const saveBasicSurvey = useSaveBasicSurveyMutation()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BasicSurveyFormValues>({
    resolver: zodResolver(basicSurveySchema),
    mode: 'onChange',
    defaultValues: {
      major: existingData?.major ?? '',
      hasProgrammingExperience: existingData?.programmingExperience?.hasExperience ?? false,
      bootcampName: existingData?.programmingExperience?.bootcampName ?? null,
      preferredLearningMethod: existingData?.preferredLearningMethod ?? 'MIXED',
      desiredJobs: existingData?.desiredJobs ?? [],
      desiredJobOther: existingData?.desiredJobOther ?? null,
      affordableBudgetRange: existingData?.affordableBudgetRange ?? 'RANGE_50_100',
    },
  })

  const hasProgrammingExperience = watch('hasProgrammingExperience')
  const desiredJobs = watch('desiredJobs')

  // 프로그래밍 경험 체크 해제 시 bootcampName 초기화
  useEffect(() => {
    if (!hasProgrammingExperience) {
      setValue('bootcampName', null)
    }
  }, [hasProgrammingExperience, setValue])

  // 기타 체크 해제 시 desiredJobOther 초기화
  useEffect(() => {
    if (!desiredJobs.includes('OTHER')) {
      setValue('desiredJobOther', null)
    }
  }, [desiredJobs, setValue])

  const onSubmit = async (values: BasicSurveyFormValues) => {
    try {
      // Transform flat form values to nested API request structure
      await saveBasicSurvey.mutateAsync({
        major: values.major,
        programmingExperience: {
          hasExperience: values.hasProgrammingExperience,
          bootcampName: values.bootcampName,
        },
        preferredLearningMethod: values.preferredLearningMethod,
        desiredJobs: values.desiredJobs,
        desiredJobOther: values.desiredJobOther,
        affordableBudgetRange: values.affordableBudgetRange,
      })
      toast.success(SURVEY_MESSAGES.SUCCESS.BASIC_SAVED)
      onComplete()
    } catch (error) {
      toast.error(SURVEY_MESSAGES.ERROR.SAVE_FAILED)
    }
  }

  const learningMethods: LearningMethod[] = ['ONLINE', 'OFFLINE', 'MIXED']
  const desiredJobOptions: DesiredJob[] = ['BACKEND', 'FRONTEND', 'DATA', 'AI', 'MOBILE', 'OTHER']
  const budgetRanges: BudgetRange[] = ['UNDER_50', 'RANGE_50_100', 'RANGE_100_200', 'OVER_200']

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Q1: 전공 */}
      <div className="space-y-2">
        <Label htmlFor="major" className="text-base font-medium">
          전공 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="major"
          {...register('major')}
          placeholder="예: 컴퓨터공학, 경영학, 디자인 등"
          className="h-11"
        />
        {errors.major && (
          <p className="text-sm text-red-500">{errors.major.message}</p>
        )}
      </div>

      {/* Q2: 프로그래밍 경험 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          프로그래밍 경험 유무 <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="hasProgrammingExperience"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                />
                <span>경험 있음</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500"
                />
                <span>경험 없음</span>
              </label>
            </div>
          )}
        />
        {hasProgrammingExperience && (
          <div className="ml-6 mt-3">
            <Label htmlFor="bootcampName" className="text-sm text-gray-600">
              부트캠프/교육과정명 (선택)
            </Label>
            <Input
              id="bootcampName"
              {...register('bootcampName')}
              placeholder="예: 삼성 SW 아카데미, 네이버 부스트캠프"
              className="mt-1 h-10"
            />
          </div>
        )}
      </div>

      {/* Q3: 선호 수업 방식 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          선호하는 수업 방식 <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="preferredLearningMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-3"
            >
              {learningMethods.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                    field.value === method
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value={method} />
                  <span>{LEARNING_METHOD_LABELS[method]}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      {/* Q4: 희망 직무 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          희망 직무 <span className="text-red-500">*</span>
          <span className="ml-2 text-sm font-normal text-gray-500">(복수 선택 가능)</span>
        </Label>
        <Controller
          name="desiredJobs"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {desiredJobOptions.map((job) => (
                <label
                  key={job}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                    field.value.includes(job)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    checked={field.value.includes(job)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, job])
                      } else {
                        field.onChange(field.value.filter((j) => j !== job))
                      }
                    }}
                  />
                  <span>{DESIRED_JOB_LABELS[job]}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.desiredJobs && (
          <p className="text-sm text-red-500">{errors.desiredJobs.message}</p>
        )}
        {desiredJobs.includes('OTHER') && (
          <div className="mt-3">
            <Input
              {...register('desiredJobOther')}
              placeholder="기타 희망 직무를 입력해주세요"
              className="h-10"
            />
            {errors.desiredJobOther && (
              <p className="mt-1 text-sm text-red-500">{errors.desiredJobOther.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Q5: 교육비 부담 가능 금액 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          교육비 자기 부담 가능 금액 <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="affordableBudgetRange"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-3"
            >
              {budgetRanges.map((range) => (
                <label
                  key={range}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                    field.value === range
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value={range} />
                  <span>{BUDGET_RANGE_LABELS[range]}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isValid || saveBasicSurvey.isPending}
          className="h-12 w-full bg-amber-500 text-white hover:bg-amber-600 disabled:bg-gray-200"
        >
          {saveBasicSurvey.isPending ? '저장 중...' : '다음 단계로'}
        </Button>
        <p className="mt-2 text-center text-sm text-gray-500">
          기초 설문을 완료하면 AI 기본 추천 기능을 사용할 수 있습니다.
        </p>
      </div>
    </form>
  )
}
