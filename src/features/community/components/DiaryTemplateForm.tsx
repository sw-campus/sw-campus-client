'use client'

import { FiInfo } from 'react-icons/fi'

import { TiptapEditor } from '@/components/ui/editor/TiptapEditor'

// 부트캠프 성장일기 템플릿 필드 최소 글자 수
export const DIARY_MIN_LENGTH = 20

// 부트캠프 성장일기 템플릿 질문들
export const DIARY_QUESTIONS = {
  learnedSkills: {
    label: '1. 이번 주에 배운 기술이나 개념 중 가장 기억에 남는 3가지는 무엇인가요?',
    placeholder:
      '예시: Spring Security, JWT 토큰, OAuth2.0 등을 배웠습니다. 특히 JWT 토큰이 어떻게 인증을 처리하는지 깊이 이해하게 되었습니다.',
  },
  problemSolving: {
    label: '2. 이번 주 과정 중 막혔던 문제나 오류가 있었나요? 어떻게 해결했나요?',
    sublabel: '(없다면 가장 인상 깊었던 실습 내용)',
    placeholder: `[문제] CORS 오류가 발생해서 API 호출이 안됐습니다.
[시도] 스택오버플로우와 공식 문서를 찾아봤습니다.
[해결] Spring Security 설정에서 CORS 설정을 추가해서 해결했습니다.`,
  },
  classReview: {
    label: '3. 이번 주 수업 진도 속도, 강사님의 강의 스타일, 혹은 반 분위기는 어땠나요?',
    placeholder:
      '예시: 진도가 너무 빨라서 벅차고 강사님은 이론보다 실습 위주입니다. 반 분위기는 다들 야간자율학습을 할 정도로 열정적입니다.',
  },
  nextWeekPlan: {
    label: '4. 다음 주에는 어떤 부분을 보완하고 싶나요?',
    placeholder: '예시: 주말 동안 자바의 정석 상권 1회독 하기, 밀린 알고리즘 문제 3개 풀기',
  },
}

export interface DiaryFormData {
  learnedSkills: string
  problemSolving: string
  classReview: string
  nextWeekPlan: string
}

export const initialDiaryFormData: DiaryFormData = {
  learnedSkills: '',
  problemSolving: '',
  classReview: '',
  nextWeekPlan: '',
}

interface DiaryTemplateFormProps {
  formData: DiaryFormData
  errors: Partial<Record<keyof DiaryFormData, string>>
  onChange: (field: keyof DiaryFormData, value: string) => void
}

/**
 * 부트캠프 성장일기 템플릿 폼 컴포넌트
 * 4가지 필수 질문에 대한 입력 폼을 제공합니다.
 */
export function DiaryTemplateForm({ formData, errors, onChange }: DiaryTemplateFormProps) {
  // HTML에서 텍스트만 추출하여 글자 수 계산
  const getTextLength = (html: string): number => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    return text.length
  }

  // 글자 수 표시 컴포넌트
  const CharCount = ({ current, min }: { current: number; min: number }) => (
    <span className={`text-xs ${current >= min ? 'text-green-600' : 'text-gray-400'}`}>
      {current}/{min}자
    </span>
  )

  return (
    <div className="space-y-6">
      {/* 가이드 안내 */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <FiInfo className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">부트캠프 성장일기 작성 가이드</p>
          <p className="mt-1 text-blue-600">
            아래 4가지 질문에 각각 {DIARY_MIN_LENGTH}자 이상 작성해주세요. 이미지를 삽입하려면 에디터 툴바의 이미지 버튼을 사용하세요!
          </p>
        </div>
      </div>

      {/* 질문 1: 배운 기술 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{DIARY_QUESTIONS.learnedSkills.label} *</label>
          <CharCount current={getTextLength(formData.learnedSkills)} min={DIARY_MIN_LENGTH} />
        </div>
        <TiptapEditor
          content={formData.learnedSkills}
          onChange={(content) => onChange('learnedSkills', content)}
          placeholder={DIARY_QUESTIONS.learnedSkills.placeholder}
          minHeight="120px"
          className={errors.learnedSkills ? 'ring-2 ring-red-500' : ''}
        />
        {errors.learnedSkills && <p className="mt-1 text-sm text-red-500">{errors.learnedSkills}</p>}
      </div>

      {/* 질문 2: 문제 해결 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {DIARY_QUESTIONS.problemSolving.label}{' '}
            <span className="text-xs font-normal text-gray-500">{DIARY_QUESTIONS.problemSolving.sublabel}</span> *
          </label>
          <CharCount current={getTextLength(formData.problemSolving)} min={DIARY_MIN_LENGTH} />
        </div>
        <TiptapEditor
          content={formData.problemSolving}
          onChange={(content) => onChange('problemSolving', content)}
          placeholder={DIARY_QUESTIONS.problemSolving.placeholder}
          minHeight="150px"
          className={errors.problemSolving ? 'ring-2 ring-red-500' : ''}
        />
        {errors.problemSolving && <p className="mt-1 text-sm text-red-500">{errors.problemSolving}</p>}
      </div>

      {/* 질문 3: 수업 리뷰 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{DIARY_QUESTIONS.classReview.label} *</label>
          <CharCount current={getTextLength(formData.classReview)} min={DIARY_MIN_LENGTH} />
        </div>
        <TiptapEditor
          content={formData.classReview}
          onChange={(content) => onChange('classReview', content)}
          placeholder={DIARY_QUESTIONS.classReview.placeholder}
          minHeight="120px"
          className={errors.classReview ? 'ring-2 ring-red-500' : ''}
        />
        {errors.classReview && <p className="mt-1 text-sm text-red-500">{errors.classReview}</p>}
      </div>

      {/* 질문 4: 다음 주 계획 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{DIARY_QUESTIONS.nextWeekPlan.label} *</label>
          <CharCount current={getTextLength(formData.nextWeekPlan)} min={DIARY_MIN_LENGTH} />
        </div>
        <TiptapEditor
          content={formData.nextWeekPlan}
          onChange={(content) => onChange('nextWeekPlan', content)}
          placeholder={DIARY_QUESTIONS.nextWeekPlan.placeholder}
          minHeight="120px"
          className={errors.nextWeekPlan ? 'ring-2 ring-red-500' : ''}
        />
        {errors.nextWeekPlan && <p className="mt-1 text-sm text-red-500">{errors.nextWeekPlan}</p>}
      </div>
    </div>
  )
}

/**
 * 템플릿 validation 함수
 */
export function validateDiaryForm(formData: DiaryFormData): Partial<Record<keyof DiaryFormData, string>> {
  const errors: Partial<Record<keyof DiaryFormData, string>> = {}

  // HTML에서 텍스트만 추출하여 글자 수 계산
  const getTextLength = (html: string): number => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    return text.length
  }

  if (getTextLength(formData.learnedSkills) < DIARY_MIN_LENGTH) {
    errors.learnedSkills = `${DIARY_MIN_LENGTH}자 이상 입력해주세요.`
  }
  if (getTextLength(formData.problemSolving) < DIARY_MIN_LENGTH) {
    errors.problemSolving = `${DIARY_MIN_LENGTH}자 이상 입력해주세요.`
  }
  if (getTextLength(formData.classReview) < DIARY_MIN_LENGTH) {
    errors.classReview = `${DIARY_MIN_LENGTH}자 이상 입력해주세요.`
  }
  if (getTextLength(formData.nextWeekPlan) < DIARY_MIN_LENGTH) {
    errors.nextWeekPlan = `${DIARY_MIN_LENGTH}자 이상 입력해주세요.`
  }

  return errors
}

/**
 * 질문 섹션 HTML 생성
 */
function buildSection(number: number, label: string, content: string, sublabel?: string): string {
  const sublabelHtml = sublabel
    ? ` <span style="font-size: 0.75rem; color: #6b7280; font-weight: normal;">${sublabel}</span>`
    : ''

  return `
<div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #f97316;">
  <h3 style="font-size: 1rem; font-weight: 600; color: #c2410c; margin: 0 0 12px 0; display: flex; align-items: baseline; gap: 8px;">
    <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #f97316; color: white; border-radius: 50%; font-size: 0.875rem; flex-shrink: 0;">${number}</span>
    <span>${label.replace(/^\d+\.\s*/, '')}${sublabelHtml}</span>
  </h3>
  <div style="color: #374151; line-height: 1.75; padding-left: 32px;">
    ${content}
  </div>
</div>`
}

/**
 * 템플릿을 HTML 본문으로 변환
 */
export function buildDiaryBody(formData: DiaryFormData): string {
  return `
<div style="display: flex; flex-direction: column; gap: 8px;">
  ${buildSection(1, DIARY_QUESTIONS.learnedSkills.label, formData.learnedSkills)}
  ${buildSection(2, DIARY_QUESTIONS.problemSolving.label, formData.problemSolving, DIARY_QUESTIONS.problemSolving.sublabel)}
  ${buildSection(3, DIARY_QUESTIONS.classReview.label, formData.classReview)}
  ${buildSection(4, DIARY_QUESTIONS.nextWeekPlan.label, formData.nextWeekPlan)}
</div>
`.trim()
}

/**
 * 기존 HTML 본문을 파싱하여 DiaryFormData로 변환
 * 수정 모드에서 기존 데이터를 템플릿 폼에 채울 때 사용
 */
export function parseDiaryBody(html: string): DiaryFormData | null {
  try {
    // 각 섹션의 내용을 추출하는 패턴
    // <div style="color: #374151; line-height: 1.75; padding-left: 32px;">...</div> 안의 내용 추출
    const sectionPattern = /<div[^>]*style="[^"]*padding-left:\s*32px[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g
    const matches = [...html.matchAll(sectionPattern)]
    
    if (matches.length !== 4) {
      return null // 4개의 섹션이 아니면 파싱 실패
    }
    
    return {
      learnedSkills: matches[0][1].trim(),
      problemSolving: matches[1][1].trim(),
      classReview: matches[2][1].trim(),
      nextWeekPlan: matches[3][1].trim(),
    }
  } catch {
    return null
  }
}

/**
 * 기존 제목을 파싱하여 월, 주차, 한줄소감으로 분리
 * 제목 형식: "X월 Y주차 성장일기 - 한줄소감"
 */
export function parseDiaryTitle(title: string): { month: number; week: number; summary: string } | null {
  try {
    const pattern = /(\d+)월\s*(\d+)주차\s*성장일기\s*-\s*(.+)/
    const match = title.match(pattern)
    
    if (!match) {
      return null
    }
    
    return {
      month: parseInt(match[1], 10),
      week: parseInt(match[2], 10),
      summary: match[3].trim(),
    }
  } catch {
    return null
  }
}

