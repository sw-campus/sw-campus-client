import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'

/** UI에서 사용하는 강의 데이터 타입 */
export interface LectureUIData {
  id: string
  organizationId: number
  title: string
  organization: string
  organizationDescription: string
  thumbnailUrl: string
  status: string
  recruitDeadline: string
  periodStart: string
  periodEnd: string
  region: string
  schedule: string
  capacity: number
  totalDays: number
  totalHours: number
  recruitType: string
  selfPayment: number
  govSupport: number
  monthlyAllowance: number
  applicationUrl: string
  qualifications: {
    required: string[]
    preferred: string[]
  }
  applicationSteps: string[]
  photos: string[]
  additionalItems: string[]
  goals: string[]
  instructors: { name: string; description: string; imageUrl?: string }[]
  services: string[]
  project: {
    count: number
    duration: string
    teamComposition: string
    tools: string[]
    hasMentor: boolean
  }
  curriculum: { title: string; level: 'basic' | 'advanced' }[]
  reviewCount: number
  reviews: unknown[]
  aiSummary: {
    location: string
    schedule: string
    type: string
    category: string
    services: string
    hasCodingTest: boolean
  }
}

/** API 응답을 UI에서 사용하는 형태로 변환하는 헬퍼 함수 */
export function mapApiToUIData(lecture: LectureDetail | undefined): LectureUIData {
  if (!lecture) {
    return {
      id: '',
      organizationId: 0,
      title: '',
      organization: '',
      organizationDescription: '기관 소개가 없습니다.',
      thumbnailUrl: '',
      status: 'RECRUITING',
      recruitDeadline: '',
      periodStart: '',
      periodEnd: '',
      region: '',
      schedule: '',
      capacity: 0,
      totalDays: 0,
      totalHours: 0,
      recruitType: 'GENERAL',
      selfPayment: 0,
      govSupport: 0,
      monthlyAllowance: 0,
      applicationUrl: '',
      qualifications: {
        required: [],
        preferred: [],
      },
      applicationSteps: [],
      photos: [],
      additionalItems: [],
      goals: [],
      instructors: [],
      services: [],
      project: {
        count: 0,
        duration: '',
        teamComposition: '',
        tools: [],
        hasMentor: false,
      },
      curriculum: [],
      reviewCount: 0,
      reviews: [],
      aiSummary: {
        location: '',
        schedule: '',
        type: '',
        category: '',
        services: '',
        hasCodingTest: false,
      },
    }
  }

  // 서비스 목록 생성
  const services: string[] = []
  if (lecture.services.books) services.push('교재 제공')
  if (lecture.services.resume) services.push('이력서 첨삭')
  if (lecture.services.mockInterview) services.push('모의 면접')
  if (lecture.services.employmentHelp) services.push('취업 지원')
  if (lecture.services.afterCompletion) services.push('수료 후 지원')

  // 자격 조건 분리
  const required = lecture.quals.filter(q => q.type === 'REQUIRED').map(q => q.text)
  const preferred = lecture.quals.filter(q => q.type === 'PREFERRED').map(q => q.text)

  // 코딩테스트 여부 확인
  const hasCodingTest = lecture.steps.some(s => s.includes('코딩') || s.toLowerCase().includes('coding'))

  return {
    id: lecture.id,
    organizationId: lecture.orgId,
    title: lecture.title,
    organization: lecture.orgName,
    organizationDescription: '기관 소개가 없습니다.',
    thumbnailUrl: lecture.thumbnailUrl || '',
    status: lecture.recruitStatus,
    recruitDeadline: lecture.schedule.recruitPeriod,
    periodStart: lecture.schedule.coursePeriod.start,
    periodEnd: lecture.schedule.coursePeriod.end,
    region: lecture.location,
    schedule: `${lecture.schedule.days} / ${lecture.schedule.time}`,
    capacity: lecture.maxCapacity,
    totalDays: lecture.schedule.totalDays,
    totalHours: lecture.schedule.totalHours,
    recruitType: lecture.recruitType,
    selfPayment: lecture.support.tuition || 0,
    govSupport: 0, // API에서 별도 제공하지 않음
    monthlyAllowance: lecture.support.stipend ? parseInt(lecture.support.stipend.replace(/[^0-9]/g, '')) : 0,
    applicationUrl: lecture.url || '',
    qualifications: {
      required,
      preferred,
    },
    applicationSteps: lecture.steps,
    photos: lecture.photos,
    additionalItems: lecture.benefits,
    goals: lecture.goal ? [lecture.goal] : [],
    instructors: lecture.teachers.map(t => ({
      name: t.name,
      description: t.desc || '강사진에 대한 소개가 없습니다.',
      imageUrl: t.imageUrl,
    })),
    services,
    project: {
      count: lecture.project.num || 0,
      duration: lecture.project.time ? `${lecture.project.time}주` : '',
      teamComposition: lecture.project.team || '',
      tools: lecture.project.tool ? lecture.project.tool.split(',').map(t => t.trim()) : [],
      hasMentor: lecture.project.mentor || false,
    },
    curriculum: lecture.curriculum.map(c => ({
      title: c.name,
      level: (c.level === 'ADVANCED' ? 'advanced' : 'basic') as 'basic' | 'advanced',
    })),
    reviewCount: 0, // 리뷰 수는 별도 API로 가져와야 함
    reviews: [],
    aiSummary: {
      location: lecture.location,
      schedule: `${lecture.lectureLoc === 'OFFLINE' ? '오프라인' : lecture.lectureLoc === 'ONLINE' ? '온라인' : '온오프혼합'}으로 ${lecture.schedule.time}`,
      type: lecture.recruitType === 'CARD_REQUIRED' ? '내일배움카드(KDT)' : '일반',
      category: lecture.categoryName,
      services: services.join(', '),
      hasCodingTest,
    },
  }
}

/** 금액을 한국 원화 형식으로 포맷 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

export type TabType = 'overview' | 'intro' | 'curriculum' | 'review'

export const tabs: { id: TabType; label: string; count?: number }[] = [
  { id: 'overview', label: '모집 개요' },
  { id: 'intro', label: '강의 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'review', label: '후기' },
]
