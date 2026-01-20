'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'

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
    setValue,
    formState: { errors, isValid },
  } = useForm<BasicSurveyFormValues>({
    resolver: zodResolver(basicSurveySchema),
    mode: 'onChange',
    defaultValues: {
      hasMajor: existingData?.majorInfo?.hasMajor ?? false,
      majorName: existingData?.majorInfo?.majorName ?? null,
      hasProgrammingExperience: existingData?.programmingExperience?.hasExperience ?? false,
      bootcampName: existingData?.programmingExperience?.bootcampName ?? null,
      preferredLearningMethod: existingData?.preferredLearningMethod ?? 'MIXED',
      desiredJobs: existingData?.desiredJobs ?? [],
      desiredJobOther: existingData?.desiredJobOther ?? null,
      affordableBudgetRange: existingData?.affordableBudgetRange ?? 'RANGE_50_100',
    },
  })

  const hasMajor = useWatch({ control, name: 'hasMajor' })
  const hasProgrammingExperience = useWatch({ control, name: 'hasProgrammingExperience' })
  const desiredJobs = useWatch({ control, name: 'desiredJobs' })

  // 전공 유무 체크 해제 시 majorName 초기화
  useEffect(() => {
    if (!hasMajor) {
      setValue('majorName', null)
    }
  }, [hasMajor, setValue])

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
        majorInfo: {
          hasMajor: values.hasMajor,
          majorName: values.majorName,
        },
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
      if (error instanceof AxiosError) {
        const status = error.response?.status
        if (!error.response) {
          toast.error(SURVEY_MESSAGES.ERROR.NETWORK_ERROR)
        } else if (status === 401 || status === 403) {
          toast.error(SURVEY_MESSAGES.ERROR.UNAUTHORIZED)
        } else if (status && status >= 500) {
          toast.error(SURVEY_MESSAGES.ERROR.SERVER_ERROR)
        } else {
          toast.error(SURVEY_MESSAGES.ERROR.SAVE_FAILED)
        }
      } else {
        toast.error(SURVEY_MESSAGES.ERROR.SAVE_FAILED)
      }
    }
  }

  const learningMethods: LearningMethod[] = ['ONLINE', 'OFFLINE', 'MIXED']
  const desiredJobOptions: DesiredJob[] = ['BACKEND', 'FRONTEND', 'DATA', 'AI', 'MOBILE', 'OTHER']
  const budgetRanges: BudgetRange[] = ['UNDER_50', 'RANGE_50_100', 'RANGE_100_200', 'OVER_200']

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Q1: 전공 유무 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          전공 유무 <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="hasMajor"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value ? 'true' : 'false'}
              onValueChange={(value) => field.onChange(value === 'true')}
              className="flex items-center gap-6"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="true" />
                <span>전공 있음</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="false" />
                <span>전공 없음 (비전공)</span>
              </label>
            </RadioGroup>
          )}
        />
        {hasMajor && (
          <div className="ml-6 mt-3">
            <Label htmlFor="majorName" className="text-sm text-muted-foreground">
              전공명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="majorName"
              {...register('majorName')}
              placeholder="예: 컴퓨터공학, 경영학, 디자인 등"
              className="mt-1 h-10"
            />
            {errors.majorName && (
              <p className="mt-1 text-sm text-destructive">{errors.majorName.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Q2: 프로그래밍 경험 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          프로그래밍 경험 유무 <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="hasProgrammingExperience"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value ? 'true' : 'false'}
              onValueChange={(value) => field.onChange(value === 'true')}
              className="flex items-center gap-6"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="true" />
                <span>경험 있음</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <RadioGroupItem value="false" />
                <span>경험 없음</span>
              </label>
            </RadioGroup>
          )}
        />
        {hasProgrammingExperience && (
          <div className="ml-6 mt-3">
            <Label htmlFor="bootcampName" className="text-sm text-muted-foreground">
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
          선호하는 수업 방식 <span className="text-destructive">*</span>
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/50'
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
          희망 직무 <span className="text-destructive">*</span>
          <span className="ml-2 text-sm font-normal text-muted-foreground">(복수 선택 가능)</span>
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/50'
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
          <p className="text-sm text-destructive">{errors.desiredJobs.message}</p>
        )}
        {desiredJobs.includes('OTHER') && (
          <div className="mt-3">
            <Input
              {...register('desiredJobOther')}
              placeholder="기타 희망 직무를 입력해주세요"
              className="h-10"
            />
            {errors.desiredJobOther && (
              <p className="mt-1 text-sm text-destructive">{errors.desiredJobOther.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Q5: 교육비 부담 가능 금액 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          교육비 자기 부담 가능 금액 <span className="text-destructive">*</span>
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/50'
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
          className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
        >
          {saveBasicSurvey.isPending ? '저장 중...' : '다음 단계로'}
        </Button>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          기초 설문을 완료하면 AI 기본 추천 기능을 사용할 수 있습니다.
        </p>
      </div>
    </form>
  )
}
