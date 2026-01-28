'use client'

import { useState, useEffect, useRef } from 'react'

import {
  FileText,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  ClipboardList,
  Image as ImageIcon,
  Gift,
  Target,
  Users,
  Briefcase,
  FolderOpen,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  FloatingInterestBar,
  PCCartSidebar,
  SectionHeader,
  CurriculumItem,
  ServiceGrid,
  QualificationsSection,
  InfoCard,
} from '@/features/bootcamp-list'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'
import LectureReviews from '@/features/lecture/components/detail/lecture-reviews'
import { useLectureDetailQuery } from '@/features/lecture/hooks/use-lecture-detail-query'

interface Props {
  lectureId: string
  initialData?: LectureDetail
}

// API 응답을 UI에서 사용하는 형태로 변환하는 헬퍼 함수
function mapApiToUIData(lecture: LectureDetail | undefined) {
  if (!lecture) {
    return {
      id: '',
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
        required: [] as string[],
        preferred: [] as string[],
      },
      applicationSteps: [] as string[],
      photos: [] as string[],
      additionalItems: [] as string[],
      goals: [] as string[],
      instructors: [] as { name: string; description: string; imageUrl?: string }[],
      services: [] as string[],
      project: {
        count: 0,
        duration: '',
        teamComposition: '',
        tools: [] as string[],
        hasMentor: false,
      },
      curriculum: [] as { title: string; level: 'basic' | 'advanced' }[],
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

type TabType = 'overview' | 'intro' | 'curriculum' | 'review'

export default function LectureDetailPage({ lectureId, initialData }: Props) {
  const router = useRouter()

  // API 호출
  const { data: lectureData, isLoading: isLectureLoading } = useLectureDetailQuery(lectureId, {
    initialData,
  })

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true)
  const [isInCart, setIsInCart] = useState(false)
  const [isFloatingBarOpen, setIsFloatingBarOpen] = useState(false)
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const headerPlaceholderRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // 장바구니 훅
  const { items: cartItems } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()

  // 비교 페이지로 이동
  const handleGoToCompare = () => {
    router.push('/cart/compare')
  }

  // API 데이터를 UI 형태로 변환
  const lecture = mapApiToUIData(lectureData)
  const isRecruiting = lecture.status === 'RECRUITING'

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'overview', label: '모집 개요' },
    { id: 'intro', label: '강의 소개' },
    { id: 'curriculum', label: '커리큘럼' },
    { id: 'review', label: '후기', count: lecture.reviewCount },
  ]

  // 스크롤 위치에 따라 헤더 고정 여부 결정 (모바일 전용)
  useEffect(() => {
    const handleScroll = () => {
      // lg 이상에서는 헤더 고정 안 함
      if (window.innerWidth >= 1024) {
        setIsHeaderFixed(false)
        return
      }
      if (headerPlaceholderRef.current) {
        const rect = headerPlaceholderRef.current.getBoundingClientRect()
        setIsHeaderFixed(rect.top <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // 스크롤 시 현재 보이는 섹션에 맞게 탭 자동 변경
  useEffect(() => {
    const sectionIds: TabType[] = ['overview', 'intro', 'curriculum', 'review']

    const handleScrollForTabs = () => {
      // 프로그래매틱 스크롤 중에는 자동 탭 변경 방지
      if (isScrolling) return

      const isMobile = window.innerWidth < 1024
      const prefix = isMobile ? 'mobile-' : ''
      // PC: 헤더(80px) + 탭(56px) + 여유 = 200px, 모바일: 200px
      const headerOffset = isMobile ? 200 : 200
      const scrollPosition = window.scrollY + headerOffset

      // 각 섹션의 절대 위치 계산
      const sectionPositions: { id: TabType; offsetTop: number }[] = []
      for (const id of sectionIds) {
        const element = document.getElementById(prefix + id)
        if (element) {
          sectionPositions.push({ id, offsetTop: element.offsetTop })
        }
      }

      // 페이지 끝에 도달했는지 확인
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100

      // 페이지 끝이면 마지막 섹션(후기) 활성화
      if (isAtBottom && sectionPositions.length > 0) {
        setActiveTab('review')
        return
      }

      // 현재 스크롤 위치보다 위에 있는 섹션 중 가장 마지막 섹션
      let activeSection: TabType = 'overview'
      for (const section of sectionPositions) {
        if (scrollPosition >= section.offsetTop) {
          activeSection = section.id
        }
      }

      setActiveTab(activeSection)
    }

    window.addEventListener('scroll', handleScrollForTabs, { passive: true })
    handleScrollForTabs() // 초기 실행

    return () => window.removeEventListener('scroll', handleScrollForTabs)
  }, [isScrolling])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const scrollToSection = (tabId: TabType) => {
    setIsScrolling(true)
    setActiveTab(tabId)
    const isMobile = window.innerWidth < 1024
    const prefix = isMobile ? 'mobile-' : ''
    const element = document.getElementById(prefix + tabId)
    if (element) {
      // PC: 헤더(80px) + 탭(56px) + 여백 = 150px, 모바일: 160px
      const offset = isMobile ? 160 : 150
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
      // 스크롤 애니메이션 완료 후 isScrolling 해제 (긴 스크롤을 위해 1.2초)
      setTimeout(() => {
        setIsScrolling(false)
      }, 1200)
    } else {
      setIsScrolling(false)
    }
  }

  // 로딩 상태 처리
  if (isLectureLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-500">강의 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!lectureData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-500">강의를 찾을 수 없습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ==================== PC 레이아웃 (lg 이상) ==================== */}
      <div className="hidden min-h-screen w-full bg-[#F5F5F5] lg:block">
        {/* Hero Section */}
        <div ref={heroRef} className="w-full">
          <div className="mx-auto max-w-[1448px] px-6 pt-6">
            <div className="relative h-[250px] w-full overflow-hidden">
              {lecture.thumbnailUrl ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${lecture.thumbnailUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <span className="text-sm text-gray-500">대표 이미지</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="mx-auto max-w-[1448px] px-6 pt-6">
          <div className="flex w-full items-center border-b border-[#020202] py-4">
            <h1 className="flex-1 text-xl font-bold text-[#020202]">{lecture.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div ref={mainContentRef} data-main-content className="mx-auto max-w-[1448px] px-6 py-6">
          <div className="flex gap-6">
            {/* Left Column - Main Content */}
            <div className="min-w-0 flex-1">
              {/* Sticky Tab Navigation */}
              <div className="sticky top-[80px] z-40">
                <div className="rounded-t-2xl border-x border-t border-gray-200 bg-white">
                  <div className="flex border-b border-gray-200 px-4">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`flex flex-1 items-center justify-center gap-2 py-4 text-base transition-colors ${
                          activeTab === tab.id
                            ? 'border-b-2 border-[#FEB706] font-semibold text-[#020202]'
                            : 'text-[#888888] hover:text-[#555555]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="text-sm text-[#888888]">({tab.count.toLocaleString()})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections Card */}
              <div className="rounded-b-2xl border-x border-b border-gray-200 bg-white">
                {/* Sections Content */}
                <div className="p-8">
                  {/* Section: 프로그램 요약 (AI) */}
                  <section id="overview" className="mb-8 scroll-mt-[200px] border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <FileText className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">프로그램 요약</span>
                      <div className="flex items-center gap-1.5 rounded-full border border-[#FEB706] bg-linear-to-r from-[#FFF4D8] to-[#FACC5A] px-4 py-1.5">
                        <Sparkles className="h-4 w-4 text-black" />
                        <span className="text-sm text-[#020202]">AI 요약</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-base leading-relaxed text-[#555555]">
                      <p>
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.location}</span>에서{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.schedule}</span>
                        으로 진행되는{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.type}</span>{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.category}</span>{' '}
                        과정입니다.
                      </p>
                      <p>
                        주요 서비스로{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.services}</span>{' '}
                        등을 제공하며, 선발절차에 코딩테스트는{' '}
                        <span className="font-semibold text-[#020202] underline">
                          {lecture.aiSummary.hasCodingTest ? '있습니다.' : '없습니다.'}
                        </span>
                      </p>
                    </div>
                  </section>

                  {/* Section: 교육기관 정보 */}
                  <section id="intro" className="mb-8 scroll-mt-[200px] border-b border-gray-200 pb-8">
                    <SectionHeader icon={<Building2 />} title="교육기관 정보" />
                    <InfoCard
                      icon={<Building2 />}
                      title={lecture.organization}
                      description={lecture.organizationDescription}
                      action={
                        <button className="flex h-8 items-center justify-center rounded-lg bg-[#EEEEEE] px-4 transition-colors hover:bg-[#E0E0E0] lg:h-10 lg:px-6">
                          <span className="text-xs text-[#020202] lg:text-sm">자세히 보기</span>
                        </button>
                      }
                    />
                  </section>

                  {/* Section: 일정 & 수업 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">일정 &amp; 수업</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {lecture.recruitDeadline && (
                        <div className="flex items-center gap-6">
                          <span className="w-20 text-base text-[#888888]">모집기간</span>
                          <span className="text-base font-semibold text-black">~{lecture.recruitDeadline}</span>
                        </div>
                      )}
                      {(lecture.periodStart || lecture.periodEnd) && (
                        <div className="flex items-center gap-6">
                          <span className="w-20 text-base text-[#888888]">수업기간</span>
                          <span className="text-base font-semibold text-black">
                            {lecture.periodStart} ~ {lecture.periodEnd}
                          </span>
                        </div>
                      )}
                      {lecture.schedule && (
                        <div className="flex items-center gap-6">
                          <span className="w-20 text-base text-[#888888]">수업시간</span>
                          <span className="text-base font-semibold text-black">{lecture.schedule}</span>
                        </div>
                      )}
                      {lecture.capacity > 0 && (
                        <div className="flex items-center gap-6">
                          <span className="w-20 text-base text-[#888888]">모집정원</span>
                          <span className="text-base font-semibold text-black">{lecture.capacity}명</span>
                        </div>
                      )}
                      {(lecture.totalDays > 0 || lecture.totalHours > 0) && (
                        <div className="flex items-center gap-6">
                          <span className="w-20 text-base text-[#888888]">총 수업</span>
                          <span className="text-base font-semibold text-black">
                            {lecture.totalDays}일({lecture.totalHours.toLocaleString()}시간)
                          </span>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Section: 수강료 & 지원금 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <DollarSign className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">수강료 &amp; 지원금</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">내배카 여부</span>
                        <span className="text-base font-semibold text-black">
                          {lecture.recruitType === 'CARD_REQUIRED' ? '필요함' : '필요없음'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">자기 부담금</span>
                        <span className="text-base font-semibold text-black">
                          {formatCurrency(lecture.selfPayment)}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">정부 지원금</span>
                        <span className="text-base font-semibold text-black">{formatCurrency(lecture.govSupport)}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">훈련수당(월)</span>
                        <span className="text-base font-semibold text-black">
                          {formatCurrency(lecture.monthlyAllowance)}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Section: 지원 자격 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <SectionHeader icon={<UserCheck />} title="지원 자격을 확인해주세요." />
                    <QualificationsSection
                      required={lecture.qualifications.required}
                      preferred={lecture.qualifications.preferred}
                    />
                  </section>

                  {/* Section: 지원 절차 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <ClipboardList className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">이런 절차로 지원할 수 있어요.</span>
                    </div>
                    {lecture.applicationSteps.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-4">
                        {lecture.applicationSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="rounded-lg border border-[#FEB706] bg-[#FFFCF4] px-5 py-2">
                              <span className="text-base text-black">{step}</span>
                            </div>
                            {idx < lecture.applicationSteps.length - 1 && (
                              <ChevronRight className="h-6 w-6 text-[#FEB706]" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">지원 절차 정보가 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 학습 공간 사진 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <ImageIcon className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">학습 공간 사진</span>
                    </div>
                    {lecture.photos.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto">
                        {lecture.photos.map((photo, idx) => (
                          <div key={idx} className="relative h-[160px] w-[240px] shrink-0">
                            <Image src={photo} alt={`학습 공간 ${idx + 1}`} fill className="rounded-lg object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">학습 공간 사진이 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 추가 제공 항목 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <Gift className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">추가 제공 항목</span>
                    </div>
                    <span className="text-base text-[#888888]">
                      {lecture.additionalItems.length > 0
                        ? lecture.additionalItems.join(', ')
                        : '추가 제공 항목에 대한 정보가 없습니다.'}
                    </span>
                  </section>

                  {/* Section: 훈련 목표 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <Target className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">훈련 목표</span>
                    </div>
                    {lecture.goals.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {lecture.goals.map((goal, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEEEEE]">
                              <span className="text-sm text-[#888888]">{idx + 1}</span>
                            </div>
                            <span className="text-base text-[#020202]">{goal}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">훈련 목표 정보가 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 강사진 소개 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <SectionHeader icon={<Users />} title="강사진 소개" />
                    {lecture.instructors.length > 0 ? (
                      lecture.instructors.map((instructor, idx) => (
                        <InfoCard
                          key={idx}
                          icon={<Users />}
                          title={instructor.name}
                          description={instructor.description}
                        />
                      ))
                    ) : (
                      <span className="text-base text-[#888888]">강사진 정보가 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 지원 서비스 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <SectionHeader icon={<Briefcase />} title="지원 서비스" />
                    <ServiceGrid services={lecture.services} />
                  </section>

                  {/* Section: 프로젝트 정보 */}
                  <section className="mb-8 border-b border-gray-200 pb-8">
                    <div className="mb-6 flex items-center gap-3">
                      <FolderOpen className="h-6 w-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">프로젝트 정보</span>
                    </div>
                    {lecture.project.count > 0 ||
                    lecture.project.duration ||
                    lecture.project.teamComposition ||
                    lecture.project.tools.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {lecture.project.count > 0 && (
                          <div className="flex items-center gap-6">
                            <span className="w-28 text-base text-[#888888]">프로젝트 수</span>
                            <span className="text-base font-semibold text-[#FEB706]">{lecture.project.count}개</span>
                          </div>
                        )}
                        {lecture.project.duration && (
                          <div className="flex items-center gap-6">
                            <span className="w-28 text-base text-[#888888]">프로젝트 기간</span>
                            <span className="text-base font-semibold text-[#020202]">{lecture.project.duration}</span>
                          </div>
                        )}
                        {lecture.project.teamComposition && (
                          <div className="flex items-center gap-6">
                            <span className="w-28 text-base text-[#888888]">팀 구성</span>
                            <span className="text-base font-semibold text-[#020202]">
                              {lecture.project.teamComposition}
                            </span>
                          </div>
                        )}
                        {lecture.project.tools.length > 0 && (
                          <div className="flex items-center gap-6">
                            <span className="w-28 text-base text-[#888888]">협업 도구</span>
                            <span className="text-base font-semibold text-[#020202]">
                              {lecture.project.tools.join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-6">
                          <span className="w-28 text-base text-[#888888]">멘토 지원</span>
                          <div className="flex items-center gap-2">
                            <Check
                              className={`h-5 w-5 ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}
                            />
                            <span
                              className={`text-base font-semibold ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}
                            >
                              {lecture.project.hasMentor ? '멘토 지원 있음' : '멘토 지원 없음'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">프로젝트 정보가 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 커리큘럼 */}
                  <section id="curriculum" className="mb-8 scroll-mt-[200px] border-b border-gray-200 pb-8">
                    <button
                      onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
                      className="mb-3 flex w-full items-center justify-between"
                    >
                      <SectionHeader icon={<BookOpen />} title="커리큘럼" />
                      <ChevronDown
                        className={`h-4 w-4 text-black transition-transform lg:h-5 lg:w-5 ${isCurriculumOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isCurriculumOpen &&
                      (lecture.curriculum.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[4px_4px_15px_rgba(161,161,170,0.25)]">
                          {lecture.curriculum.map((item, idx) => (
                            <CurriculumItem
                              key={idx}
                              index={idx + 1}
                              title={item.title}
                              level={item.level as 'basic' | 'advanced'}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-base text-[#888888]">커리큘럼 정보가 없습니다.</span>
                      ))}
                  </section>

                  {/* Section: 후기 */}
                  <section id="review" className="min-h-[400px] scroll-mt-[200px]">
                    <LectureReviews lectureId={lecture.id} />
                  </section>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="w-[280px] shrink-0 xl:w-[320px]">
              <div className="sticky top-[110px]">
                {/* Info Card */}
                <div className="rounded-2xl bg-white p-5 shadow-lg">
                  {/* 기관명 + 모집중 뱃지 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#888888]">{lecture.organization}</span>
                    <div
                      className={`flex h-5 shrink-0 items-center justify-center gap-1 rounded-full px-2 ${
                        isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span
                        className={`text-[10px] font-medium ${isRecruiting ? 'text-emerald-600' : 'text-gray-500'}`}
                      >
                        {isRecruiting ? '모집중' : '모집마감'}
                      </span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-[#020202]">{lecture.title}</h3>

                  {/* 구분선 */}
                  <div className="my-4 border-t border-gray-200" />

                  {/* 정보 (라벨 + 값) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <span className="w-16 shrink-0 text-xs text-[#888888]">모집기간</span>
                      <span className="text-sm text-[#020202]">~{lecture.recruitDeadline}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 shrink-0 text-xs text-[#888888]">수업기간</span>
                      <span className="text-sm text-[#020202]">
                        {lecture.periodStart} ~ {lecture.periodEnd}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 shrink-0 text-xs text-[#888888]">지역</span>
                      <span className="text-sm text-[#020202]">{lecture.region}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 shrink-0 text-xs text-[#888888]">수업시간</span>
                      <span className="text-sm text-[#020202]">{lecture.schedule}</span>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="my-4 border-t border-gray-200" />

                  {/* 버튼들 */}
                  {lecture.applicationUrl ? (
                    <a
                      href={lecture.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 flex h-10 w-full items-center justify-center rounded-lg bg-[#262626] transition-colors hover:bg-[#333333]"
                    >
                      <span className="text-sm font-medium text-[#FEB706]">신청페이지 바로가기</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="mb-3 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-300"
                    >
                      <span className="text-sm font-medium text-gray-500">신청 URL 준비중</span>
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsInCart(!isInCart)}
                      className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg transition-colors ${
                        isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
                        {isInCart ? '관심등록됨' : '관심등록'}
                      </span>
                    </button>
                    <button
                      onClick={handleGoToCompare}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#FEB706] transition-colors hover:bg-[#E5A605]"
                    >
                      <span className="text-sm font-medium text-[#404040]">비교하기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PC Cart Sidebar - 컴포넌트 자체에서 위치 계산 */}
      <PCCartSidebar items={cartItems} onRemove={id => removeFromCart(id)} onCompare={handleGoToCompare} />

      {/* ==================== 모바일 레이아웃 (lg 미만) ==================== */}
      <div className="flex min-h-screen w-full flex-col bg-white lg:hidden">
        {/* Hero Image */}
        <div className="relative h-[250px] w-full">
          {lecture.thumbnailUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${lecture.thumbnailUrl})` }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-500">대표 이미지</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex w-full flex-col gap-6 px-4 py-[30px]">
          {/* Header: Organization + Status */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#555555]">{lecture.organization}</span>
              <div
                className={`flex h-5 items-center justify-center gap-1 rounded-full px-2 ${
                  isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                <span className={`text-[10px] font-medium ${isRecruiting ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {isRecruiting ? '모집중' : '모집마감'}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl leading-tight font-bold text-[#020202]">{lecture.title}</h1>
          </div>

          {/* Quick Info */}
          <div className="flex flex-col gap-3 border-t border-b border-gray-200 p-[10px]">
            <div className="flex items-center gap-6">
              <span className="w-[50px] shrink-0 text-xs text-[#888888]">모집기간</span>
              <span className="text-xs font-semibold text-black">~{lecture.recruitDeadline}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="w-[50px] shrink-0 text-xs text-[#888888]">수업기간</span>
              <span className="text-xs font-semibold text-black">
                {lecture.periodStart} ~ {lecture.periodEnd}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="fshrink-0 w-[50px] text-xs text-[#888888]">지역</span>
              <span className="text-xs font-semibold text-black">{lecture.region}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="w-[50px] shrink-0 text-xs text-[#888888]">수업시간</span>
              <span className="text-xs font-semibold text-black">{lecture.schedule}</span>
            </div>
          </div>

          {/* Header placeholder - 고정 위치 감지용 */}
          <div ref={headerPlaceholderRef} className={isHeaderFixed ? 'h-[140px]' : 'h-0'} />

          {/* Action Buttons + Tab Navigation */}
          <div
            ref={headerRef}
            className={` ${isHeaderFixed ? 'fixed top-0 right-0 left-0 pt-0' : '-mx-4 pt-2'} z-40 border-b border-gray-100 bg-white px-4 pb-0 shadow-md`}
          >
            {/* Action Buttons */}
            <div className={`mb-2 flex flex-col gap-2 ${isHeaderFixed ? 'mx-auto max-w-[360px]' : ''}`}>
              {lecture.applicationUrl ? (
                <a
                  href={lecture.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-[#262626]"
                >
                  <span className="text-xs text-[#FEB706]">신청페이지 바로가기</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-300"
                >
                  <span className="text-xs text-gray-500">신청 URL 준비중</span>
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsInCart(!isInCart)}
                  className={`flex h-10 flex-1 items-center justify-center gap-1 rounded-lg ${
                    isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'
                  }`}
                >
                  {isInCart && <Check className="h-3 w-3 text-[#FEB706]" />}
                  <span className={`text-xs font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
                    {isInCart ? '관심등록됨' : '관심등록'}
                  </span>
                </button>
                <button
                  onClick={handleGoToCompare}
                  className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#FEB706]"
                >
                  <span className="text-xs font-medium text-[#404040]">비교하기</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`flex border-b border-gray-200 ${isHeaderFixed ? 'mx-auto max-w-[360px]' : ''}`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1 py-3 ${
                    activeTab === tab.id ? 'border-b-2 border-[#FEB706] font-semibold' : ''
                  }`}
                >
                  <span className="text-sm text-black">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-xs text-[#888888]">({tab.count.toLocaleString()})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: 프로그램 요약 (AI) */}
          <section id="mobile-overview" className="flex scroll-mt-40 flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">프로그램 요약</span>
              <div className="flex items-center gap-1 rounded-full border border-[#FEB706] bg-linear-to-r from-[#FFF4D8] to-[#FACC5A] px-3 py-1">
                <Sparkles className="h-3 w-3 text-black" />
                <span className="text-xs text-[#020202]">AI 요약</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#555555]">
                <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.location}</span>에서{' '}
                <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.schedule}</span>으로
              </p>
              <p className="text-sm text-[#555555]">
                진행되는 <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.type}</span>{' '}
                <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.category}</span> 과정입니다.
              </p>
              <p className="text-sm text-[#555555]">
                주요 서비스로{' '}
                <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.services}</span> 등을
                제공하며,
              </p>
              <p className="text-sm text-[#555555]">
                선발절차에 코딩테스트는{' '}
                <span className="font-semibold text-[#020202] underline">
                  {lecture.aiSummary.hasCodingTest ? '있습니다.' : '없습니다.'}
                </span>
              </p>
            </div>
          </section>

          {/* Section: 교육기관 정보 */}
          <section id="mobile-intro" className="flex scroll-mt-40 flex-col gap-6 border-b border-gray-200 pb-6">
            <SectionHeader icon={<Building2 />} title="교육기관 정보" />
            <InfoCard
              icon={<Building2 />}
              title={lecture.organization}
              description={lecture.organizationDescription}
              action={
                <button className="flex h-8 items-center justify-center rounded-lg bg-[#EEEEEE] px-4 transition-colors hover:bg-[#E0E0E0] lg:h-10 lg:px-6">
                  <span className="text-xs text-[#020202] lg:text-sm">자세히 보기</span>
                </button>
              }
            />
          </section>

          {/* Section: 일정 & 수업 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">일정 &amp; 수업</span>
            </div>
            <div className="flex flex-col gap-3">
              {lecture.recruitDeadline && (
                <div className="flex items-center gap-6">
                  <span className="w-14 text-sm text-[#888888]">모집기간</span>
                  <span className="text-sm font-semibold text-black">~{lecture.recruitDeadline}</span>
                </div>
              )}
              {(lecture.periodStart || lecture.periodEnd) && (
                <div className="flex items-center gap-6">
                  <span className="w-14 text-sm text-[#888888]">수업기간</span>
                  <span className="text-sm font-semibold text-black">
                    {lecture.periodStart} ~ {lecture.periodEnd}
                  </span>
                </div>
              )}
              {lecture.schedule && (
                <div className="flex items-center gap-6">
                  <span className="w-14 text-sm text-[#888888]">수업시간</span>
                  <span className="text-sm font-semibold text-black">{lecture.schedule}</span>
                </div>
              )}
              {lecture.capacity > 0 && (
                <div className="flex items-center gap-6">
                  <span className="w-14 text-sm text-[#888888]">모집정원</span>
                  <span className="text-sm font-semibold text-black">{lecture.capacity}명</span>
                </div>
              )}
              {(lecture.totalDays > 0 || lecture.totalHours > 0) && (
                <div className="flex items-center gap-6">
                  <span className="w-14 text-sm text-[#888888]">총 수업</span>
                  <span className="text-sm font-semibold text-black">
                    {lecture.totalDays}일({lecture.totalHours.toLocaleString()}시간)
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Section: 수강료 & 지원금 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">수강료 &amp; 지원금</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-6">
                <span className="w-[81px] text-sm text-[#888888]">내배카 여부</span>
                <span className="text-sm font-semibold text-black">
                  {lecture.recruitType === 'CARD_REQUIRED' ? '필요함' : '필요없음'}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="w-[81px] text-sm text-[#888888]">자기 부담금</span>
                <span className="text-sm font-semibold text-black">{formatCurrency(lecture.selfPayment)}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="w-[81px] text-sm text-[#888888]">정부 지원금</span>
                <span className="text-sm font-semibold text-black">{formatCurrency(lecture.govSupport)}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="w-[81px] text-sm text-[#888888]">훈련수당(월)</span>
                <span className="text-sm font-semibold text-black">{formatCurrency(lecture.monthlyAllowance)}</span>
              </div>
            </div>
          </section>

          {/* Section: 지원 자격 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <SectionHeader icon={<UserCheck />} title="지원 자격을 확인해주세요." />
            <QualificationsSection
              required={lecture.qualifications.required}
              preferred={lecture.qualifications.preferred}
            />
          </section>

          {/* Section: 지원 절차 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">이런 절차로 지원할 수 있어요.</span>
            </div>
            {lecture.applicationSteps.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                {lecture.applicationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="rounded-lg border border-[#FEB706] bg-[#FFFCF4] px-3 py-1.5">
                      <span className="text-sm text-black">{step}</span>
                    </div>
                    {idx < lecture.applicationSteps.length - 1 && <ChevronRight className="h-5 w-5 text-[#FEB706]" />}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-[#888888]">지원 절차 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 학습 공간 사진 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">학습 공간 사진</span>
            </div>
            {lecture.photos.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto">
                {lecture.photos.map((photo, idx) => (
                  <div key={idx} className="relative h-[138px] w-[200px] shrink-0">
                    <Image src={photo} alt={`학습 공간 ${idx + 1}`} fill className="rounded-lg object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-[#888888]">학습 공간 사진 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 추가 제공 항목 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">추가 제공 항목</span>
            </div>
            {lecture.additionalItems.length > 0 ? (
              <span className="text-sm text-[#020202]">{lecture.additionalItems.join(', ')}</span>
            ) : (
              <span className="text-sm text-[#888888]">추가 제공 항목 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 훈련 목표 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">훈련 목표</span>
            </div>
            {lecture.goals.length > 0 ? (
              <div className="flex flex-col gap-3">
                {lecture.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEEEEE]">
                      <span className="text-xs text-[#888888]">{idx + 1}</span>
                    </div>
                    <span className="text-sm text-[#020202]">{goal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-[#888888]">훈련 목표 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 강사진 소개 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <SectionHeader icon={<Users />} title="강사진 소개" />
            {lecture.instructors.length > 0 ? (
              lecture.instructors.map((instructor, idx) => (
                <InfoCard key={idx} icon={<Users />} title={instructor.name} description={instructor.description} />
              ))
            ) : (
              <span className="text-sm text-[#888888]">강사진 소개 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 지원 서비스 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <SectionHeader icon={<Briefcase />} title="지원 서비스" />
            <ServiceGrid services={lecture.services} />
          </section>

          {/* Section: 프로젝트 정보 */}
          <section className="flex flex-col gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-[#FEB706]" />
              <span className="text-base font-semibold text-[#020202]">프로젝트 정보</span>
            </div>
            {lecture.project.count > 0 ||
            lecture.project.duration ||
            lecture.project.teamComposition ||
            lecture.project.tools.length > 0 ? (
              <div className="flex flex-col gap-3">
                {lecture.project.count > 0 && (
                  <div className="flex items-center gap-6">
                    <span className="w-[90px] text-sm text-[#888888]">프로젝트 수</span>
                    <span className="text-sm font-semibold text-[#FEB706]">{lecture.project.count}개</span>
                  </div>
                )}
                {lecture.project.duration && (
                  <div className="flex items-center gap-6">
                    <span className="w-[90px] text-sm text-[#888888]">프로젝트 기간</span>
                    <span className="text-sm font-semibold text-[#020202]">{lecture.project.duration}</span>
                  </div>
                )}
                {lecture.project.teamComposition && (
                  <div className="flex items-center gap-6">
                    <span className="w-[90px] text-sm text-[#888888]">팀 구성</span>
                    <span className="text-sm font-semibold text-[#020202]">{lecture.project.teamComposition}</span>
                  </div>
                )}
                {lecture.project.tools.length > 0 && (
                  <div className="flex items-center gap-6">
                    <span className="w-[90px] text-sm text-[#888888]">협업 도구</span>
                    <span className="text-sm font-semibold text-[#020202]">{lecture.project.tools.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <span className="w-[90px] text-sm text-[#888888]">멘토 지원</span>
                  <div className="flex items-center gap-1">
                    <Check
                      className={`h-[14px] w-[14px] ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-sm font-semibold ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}
                    >
                      {lecture.project.hasMentor ? '멘토 지원 있음' : '멘토 지원 없음'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-sm text-[#888888]">프로젝트 정보가 없습니다.</span>
            )}
          </section>

          {/* Section: 커리큘럼 */}
          <section id="mobile-curriculum" className="flex scroll-mt-40 flex-col gap-6 border-b border-gray-200 pb-6">
            <button
              onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
              className="flex w-full items-center justify-between"
            >
              <SectionHeader icon={<BookOpen />} title="커리큘럼" />
              <ChevronDown
                className={`h-4 w-4 text-black transition-transform lg:h-5 lg:w-5 ${isCurriculumOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isCurriculumOpen &&
              (lecture.curriculum.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[4px_4px_15px_rgba(161,161,170,0.25)]">
                  {lecture.curriculum.map((item, idx) => (
                    <CurriculumItem
                      key={idx}
                      index={idx + 1}
                      title={item.title}
                      level={item.level as 'basic' | 'advanced'}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-[#888888]">커리큘럼 정보가 없습니다.</span>
              ))}
          </section>

          {/* Section: 후기 */}
          <section
            id="mobile-review"
            className="flex min-h-[300px] scroll-mt-40 flex-col gap-6 border-b border-gray-200 pb-6"
          >
            <LectureReviews lectureId={lecture.id} />
          </section>

          {/* 플로팅 바 공간 확보 */}
          <div className="h-[100px]" />
        </div>

        {/* 하단 플로팅 관심 항목 바 (모바일 전용) */}
        <FloatingInterestBar
          items={cartItems}
          onRemove={id => removeFromCart(id)}
          onCompare={handleGoToCompare}
          isOpen={isFloatingBarOpen}
          onToggleOpen={() => setIsFloatingBarOpen(prev => !prev)}
        />
      </div>
    </>
  )
}
