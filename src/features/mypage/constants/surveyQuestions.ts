import type { JobTypeCode } from '../types/survey.type'

/**
 * 성향 테스트 문항 정의 (15문항)
 * - Part 1 (Q1-Q4): 논리 및 사고력 - 정답 있음, 서버에서 채점
 * - Part 2 (Q5-Q8): 끈기 및 학습 태도 - 선택지별 점수
 * - Part 3 (Q9-Q15): 직무 성향 - F/B/D 카운트
 */

export interface AptitudeQuestion {
  id: string
  part: 1 | 2 | 3
  question: string
  options: AptitudeOption[]
}

export interface AptitudeOption {
  value: number | JobTypeCode
  label: string
}

// Part 1: 논리 및 사고력 (4문항)
export const PART1_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q1',
    part: 1,
    question: '다음 수열에서 빈칸에 들어갈 숫자는?\n\n2, 6, 12, 20, 30, ?',
    options: [
      { value: 1, label: '40' },
      { value: 2, label: '42' },
      { value: 3, label: '44' },
    ],
  },
  {
    id: 'q2',
    part: 1,
    question:
      '로봇 청소기가 다음 명령을 순서대로 실행합니다.\n\n1. 앞으로 2칸 이동\n2. 오른쪽으로 90도 회전\n3. 앞으로 1칸 이동\n4. 왼쪽으로 90도 회전\n5. 앞으로 2칸 이동\n\n로봇이 최종 도착한 위치와 바라보는 방향은?',
    options: [
      { value: 1, label: '원래 위치에서 오른쪽으로 1칸, 앞으로 4칸 / 위쪽' },
      { value: 2, label: '원래 위치에서 오른쪽으로 1칸, 앞으로 4칸 / 오른쪽' },
      { value: 3, label: '원래 위치에서 오른쪽으로 2칸, 앞으로 3칸 / 위쪽' },
    ],
  },
  {
    id: 'q3',
    part: 1,
    question:
      '"모든 개발자는 커피를 좋아한다"가 참일 때, 반드시 참인 것은?',
    options: [
      { value: 1, label: '커피를 좋아하면 개발자이다' },
      { value: 2, label: '커피를 좋아하지 않으면 개발자가 아니다' },
      { value: 3, label: '개발자가 아니면 커피를 좋아하지 않는다' },
    ],
  },
  {
    id: 'q4',
    part: 1,
    question:
      '다음 중 나머지와 성격이 다른 하나는?\n\n사과, 바나나, 딸기, 과일, 포도',
    options: [
      { value: 1, label: '사과' },
      { value: 2, label: '딸기' },
      { value: 3, label: '과일' },
    ],
  },
]

// Part 2: 끈기 및 학습 태도 (4문항)
export const PART2_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q5',
    part: 2,
    question: '코딩 중 에러가 발생했을 때, 당신의 첫 반응은?',
    options: [
      { value: 1, label: '짜증이 나고 포기하고 싶다' },
      { value: 2, label: '일단 구글에 에러 메시지를 검색한다' },
      { value: 3, label: '원인을 분석하고 디버깅을 시작한다' },
    ],
  },
  {
    id: 'q6',
    part: 2,
    question: '새로운 기계나 프로그램을 다룰 때 당신의 스타일은?',
    options: [
      { value: 1, label: '설명서를 꼼꼼히 읽고 시작한다' },
      { value: 2, label: '일단 이것저것 눌러보며 익힌다' },
      { value: 3, label: '유튜브 튜토리얼을 보면서 따라한다' },
    ],
  },
  {
    id: 'q7',
    part: 2,
    question: '단순 반복 작업을 할 때 당신의 생각은?',
    options: [
      { value: 1, label: '그냥 빨리 끝내고 싶다' },
      { value: 2, label: '이걸 자동화할 수 있을까 고민한다' },
      { value: 3, label: '효율적인 패턴을 찾으려 한다' },
    ],
  },
  {
    id: 'q8',
    part: 2,
    question: '개발자가 되고 싶은 가장 큰 이유는?',
    options: [
      { value: 1, label: '연봉이 높아서' },
      { value: 2, label: '내 아이디어를 직접 구현하고 싶어서' },
      { value: 3, label: '문제를 해결하는 과정이 재미있어서' },
    ],
  },
]

// Part 3: 직무 성향 정밀 진단 (7문항)
export const PART3_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q9',
    part: 3,
    question: '식당 창업을 한다면 가장 관심이 가는 분야는?',
    options: [
      { value: 'F' as JobTypeCode, label: '메뉴판 디자인과 인테리어' },
      { value: 'B' as JobTypeCode, label: '주문 시스템과 재고 관리' },
      { value: 'D' as JobTypeCode, label: '고객 데이터 분석과 마케팅' },
    ],
  },
  {
    id: 'q10',
    part: 3,
    question: '레고 조립할 때 가장 희열을 느끼는 순간은?',
    options: [
      { value: 'F' as JobTypeCode, label: '완성된 결과물을 보는 순간' },
      { value: 'B' as JobTypeCode, label: '기어가 맞물려 기계가 작동할 때' },
      { value: 'D' as JobTypeCode, label: '설명서에서 패턴을 발견할 때' },
    ],
  },
  {
    id: 'q11',
    part: 3,
    question: '엑셀이나 PPT 작업 시 당신의 스타일은?',
    options: [
      { value: 'F' as JobTypeCode, label: '시각적으로 깔끔하게 정리하는 것' },
      { value: 'B' as JobTypeCode, label: '폴더 구조와 파일명을 체계적으로 관리' },
      { value: 'D' as JobTypeCode, label: '함수와 수식으로 자동화하는 것' },
    ],
  },
  {
    id: 'q12',
    part: 3,
    question: '앱 개발 팀 회의에서 가장 흥미로운 대화는?',
    options: [
      { value: 'F' as JobTypeCode, label: '"이 버튼 색상을 바꾸면 더 예쁠 것 같아요"' },
      { value: 'B' as JobTypeCode, label: '"이 데이터는 어디서 가져오나요?"' },
      { value: 'D' as JobTypeCode, label: '"사용자들이 이 기능을 얼마나 쓰나요?"' },
    ],
  },
  {
    id: 'q13',
    part: 3,
    question: '앱 버그 중 가장 용서 못하는 것은?',
    options: [
      { value: 'F' as JobTypeCode, label: 'UI가 깨지거나 불편한 것' },
      { value: 'B' as JobTypeCode, label: '로딩이 느리거나 서버가 죽는 것' },
      { value: 'D' as JobTypeCode, label: '추천이 엉뚱하거나 검색이 이상한 것' },
    ],
  },
  {
    id: 'q14',
    part: 3,
    question: '딱 하나만 만들 수 있다면?',
    options: [
      { value: 'F' as JobTypeCode, label: '화려하고 예쁜 웹사이트' },
      { value: 'B' as JobTypeCode, label: '튼튼하고 빠른 서버' },
      { value: 'D' as JobTypeCode, label: '똑똑한 AI 비서' },
    ],
  },
  {
    id: 'q15',
    part: 3,
    question: '서점에서 무심코 집어 든 책은?',
    options: [
      { value: 'F' as JobTypeCode, label: '좋은 디자인의 비밀' },
      { value: 'B' as JobTypeCode, label: '시스템을 설계하는 방법' },
      { value: 'D' as JobTypeCode, label: '통계로 세상 읽기' },
    ],
  },
]

// 전체 문항
export const ALL_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  ...PART1_QUESTIONS,
  ...PART2_QUESTIONS,
  ...PART3_QUESTIONS,
]

// Part별 문항 수
export const PART_COUNTS = {
  part1: PART1_QUESTIONS.length,
  part2: PART2_QUESTIONS.length,
  part3: PART3_QUESTIONS.length,
  total: ALL_APTITUDE_QUESTIONS.length,
}
