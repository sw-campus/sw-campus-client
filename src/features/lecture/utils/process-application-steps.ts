/**
 * 지원 절차에서 사전과제를 분리하는 유틸리티 함수
 * 사전과제는 합격 후 진행되는 단계이므로 일반 지원절차와 분리하여 표시
 */
export interface ProcessedApplicationSteps {
  /** 사전과제를 제외한 일반 지원 절차 */
  applicationSteps: string[]
  /** 사전과제 포함 여부 */
  hasPreTask: boolean
}

const PRE_TASK_STEP = '사전과제'

/**
 * 지원 절차 배열에서 사전과제를 분리합니다.
 * @param steps 원본 지원 절차 배열
 * @returns 사전과제가 분리된 결과 객체
 *
 * @example
 * const { applicationSteps, hasPreTask } = processApplicationSteps(lecture.steps)
 * // applicationSteps: ['서류전형', '면접'] (사전과제 제외)
 * // hasPreTask: true (사전과제가 있었음)
 */
export function processApplicationSteps(steps: string[] | undefined | null): ProcessedApplicationSteps {
  if (!steps || steps.length === 0) {
    return {
      applicationSteps: [],
      hasPreTask: false,
    }
  }

  return {
    applicationSteps: steps.filter(step => step !== PRE_TASK_STEP),
    hasPreTask: steps.includes(PRE_TASK_STEP),
  }
}
