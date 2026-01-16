/**
 * 설문조사 관련 메시지 상수
 */
export const SURVEY_MESSAGES = {
  // 성공 메시지
  SUCCESS: {
    BASIC_SAVED: '기초 설문이 저장되었습니다.',
    APTITUDE_COMPLETED: '성향 테스트가 완료되었습니다.',
  },

  // 에러 메시지
  ERROR: {
    SAVE_FAILED: '저장 중 오류가 발생했습니다.',
    SUBMIT_FAILED: '제출 중 오류가 발생했습니다.',
    INCOMPLETE_ANSWERS: '모든 문항에 답변해주세요.',
  },
} as const
