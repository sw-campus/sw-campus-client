'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  FloatingInterestBar,
  PCCartSidebar,
  SectionHeader,
  CurriculumItem,
  ServiceGrid,
  QualificationsSection,
  InfoCard,
} from '@/features/bootcamp-list'
import LectureReviews from '@/features/lecture/components/detail/lecture-reviews'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { useLectureDetailQuery } from '@/features/lecture/hooks/use-lecture-detail-query'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'

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
  const hasCodingTest = lecture.steps.some(s =>
    s.includes('코딩') || s.toLowerCase().includes('coding')
  )

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
      const isMobile = window.innerWidth < 1024
      const prefix = isMobile ? 'mobile-' : ''
      const headerOffset = isMobile ? 180 : 100
      const scrollPosition = window.scrollY + headerOffset

      // 각 섹션의 절대 위치 계산
      const sectionPositions: { id: TabType; offsetTop: number }[] = []
      for (const id of sectionIds) {
        const element = document.getElementById(prefix + id)
        if (element) {
          sectionPositions.push({ id, offsetTop: element.offsetTop })
        }
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
  }, [])


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId)
    const isMobile = window.innerWidth < 1024
    const prefix = isMobile ? 'mobile-' : ''
    const element = document.getElementById(prefix + tabId)
    if (element) {
      const offset = 160 // sticky buttons + tab height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
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
      <div className="hidden lg:block w-full min-h-screen bg-[#F5F5F5]">
        {/* Hero Section */}
        <div ref={heroRef} className="w-full">
          <div className="max-w-[1448px] mx-auto px-6 pt-6">
            <div className="w-full h-[250px] relative overflow-hidden">
              {lecture.thumbnailUrl ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${lecture.thumbnailUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">대표 이미지</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="max-w-[1448px] mx-auto px-6 pt-6">
          <div className="w-full py-4 border-b border-[#020202] flex items-center">
            <h1 className="flex-1 text-xl font-bold text-[#020202]">{lecture.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div ref={mainContentRef} data-main-content className="max-w-[1448px] mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* Left Column - Main Content */}
            <div className="flex-1 min-w-0">
              {/* Sticky Tab Navigation */}
              <div className="sticky top-[80px] z-40">
                <div className="bg-white rounded-t-2xl border-x border-t border-gray-200">
                  <div className="border-b border-gray-200 flex px-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-base transition-colors ${
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
              <div className="bg-white rounded-b-2xl border-x border-b border-gray-200">
                {/* Sections Content */}
                <div className="p-8">
                  {/* Section: 프로그램 요약 (AI) */}
                  <section id="overview" className="pb-8 border-b border-gray-200 mb-8 scroll-mt-[200px]">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">프로그램 요약</span>
                      <div className="px-4 py-1.5 bg-gradient-to-r from-[#FFF4D8] to-[#FACC5A] rounded-full border border-[#FEB706] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-sm text-[#020202]">AI 요약</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-base text-[#555555] leading-relaxed">
                      <p>
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.location}</span>에서{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.schedule}</span>
                        으로 진행되는{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.type}</span>{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.category}</span> 과정입니다.
                      </p>
                      <p>
                        주요 서비스로{' '}
                        <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.services}</span>
                        {' '}등을 제공하며, 선발절차에 코딩테스트는{' '}
                        <span className="font-semibold text-[#020202] underline">
                          {lecture.aiSummary.hasCodingTest ? '있습니다.' : '없습니다.'}
                        </span>
                      </p>
                    </div>
                  </section>

                  {/* Section: 교육기관 정보 */}
                  <section id="intro" className="pb-8 border-b border-gray-200 mb-8 scroll-mt-[200px]">
                    <SectionHeader icon={<Building2 />} title="교육기관 정보" />
                    <InfoCard
                      icon={<Building2 />}
                      title={lecture.organization}
                      description={lecture.organizationDescription}
                      action={
                        <button className="h-8 lg:h-10 px-4 lg:px-6 bg-[#EEEEEE] rounded-lg flex items-center justify-center hover:bg-[#E0E0E0] transition-colors">
                          <span className="text-xs lg:text-sm text-[#020202]">자세히 보기</span>
                        </button>
                      }
                    />
                  </section>

                  {/* Section: 일정 & 수업 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-6 h-6 text-[#FEB706]" />
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
                          <span className="text-base font-semibold text-black">{lecture.periodStart} ~ {lecture.periodEnd}</span>
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
                          <span className="text-base font-semibold text-black">{lecture.totalDays}일({lecture.totalHours.toLocaleString()}시간)</span>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Section: 수강료 & 지원금 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <DollarSign className="w-6 h-6 text-[#FEB706]" />
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
                        <span className="text-base font-semibold text-black">{formatCurrency(lecture.selfPayment)}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">정부 지원금</span>
                        <span className="text-base font-semibold text-black">{formatCurrency(lecture.govSupport)}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="w-24 text-base text-[#888888]">훈련수당(월)</span>
                        <span className="text-base font-semibold text-black">{formatCurrency(lecture.monthlyAllowance)}</span>
                      </div>
                    </div>
                  </section>

                  {/* Section: 지원 자격 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <SectionHeader icon={<UserCheck />} title="지원 자격을 확인해주세요." />
                    <QualificationsSection
                      required={lecture.qualifications.required}
                      preferred={lecture.qualifications.preferred}
                    />
                  </section>

                  {/* Section: 지원 절차 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <ClipboardList className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">이런 절차로 지원할 수 있어요.</span>
                    </div>
                    {lecture.applicationSteps.length > 0 ? (
                      <div className="flex items-center gap-4 flex-wrap">
                        {lecture.applicationSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="px-5 py-2 bg-[#FFFCF4] rounded-lg border border-[#FEB706]">
                              <span className="text-base text-black">{step}</span>
                            </div>
                            {idx < lecture.applicationSteps.length - 1 && (
                              <ChevronRight className="w-6 h-6 text-[#FEB706]" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">지원 절차 정보가 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 학습 공간 사진 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <ImageIcon className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">학습 공간 사진</span>
                    </div>
                    {lecture.photos.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto">
                        {lecture.photos.map((photo, idx) => (
                          <img key={idx} src={photo} alt={`학습 공간 ${idx + 1}`} className="w-[240px] h-[160px] rounded-lg object-cover" />
                        ))}
                      </div>
                    ) : (
                      <span className="text-base text-[#888888]">학습 공간 사진이 없습니다.</span>
                    )}
                  </section>

                  {/* Section: 추가 제공 항목 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Gift className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">추가 제공 항목</span>
                    </div>
                    <span className="text-base text-[#888888]">
                      {lecture.additionalItems.length > 0
                        ? lecture.additionalItems.join(', ')
                        : '추가 제공 항목에 대한 정보가 없습니다.'}
                    </span>
                  </section>

                  {/* Section: 훈련 목표 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">훈련 목표</span>
                    </div>
                    {lecture.goals.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {lecture.goals.map((goal, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#EEEEEE] rounded-full flex items-center justify-center flex-shrink-0">
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
                  <section className="pb-8 border-b border-gray-200 mb-8">
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
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <SectionHeader icon={<Briefcase />} title="지원 서비스" />
                    <ServiceGrid services={lecture.services} />
                  </section>

                  {/* Section: 프로젝트 정보 */}
                  <section className="pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <FolderOpen className="w-6 h-6 text-[#FEB706]" />
                      <span className="text-lg font-semibold text-[#020202]">프로젝트 정보</span>
                    </div>
                    {(lecture.project.count > 0 || lecture.project.duration || lecture.project.teamComposition || lecture.project.tools.length > 0) ? (
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
                            <span className="text-base font-semibold text-[#020202]">{lecture.project.teamComposition}</span>
                          </div>
                        )}
                        {lecture.project.tools.length > 0 && (
                          <div className="flex items-center gap-6">
                            <span className="w-28 text-base text-[#888888]">협업 도구</span>
                            <span className="text-base font-semibold text-[#020202]">{lecture.project.tools.join(', ')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-6">
                          <span className="w-28 text-base text-[#888888]">멘토 지원</span>
                          <div className="flex items-center gap-2">
                            <Check className={`w-5 h-5 ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`} />
                            <span className={`text-base font-semibold ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}>
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
                  <section id="curriculum" className="pb-8 border-b border-gray-200 mb-8 scroll-mt-[200px]">
                    <button
                      onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
                      className="w-full flex justify-between items-center mb-3"
                    >
                      <SectionHeader icon={<BookOpen />} title="커리큘럼" />
                      <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-black transition-transform ${isCurriculumOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCurriculumOpen && (
                      lecture.curriculum.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-[4px_4px_15px_rgba(161,161,170,0.25)] overflow-hidden border border-gray-100">
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
                      )
                    )}
                  </section>

                  {/* Section: 후기 */}
                  <section id="review" className="scroll-mt-[200px]">
                    <LectureReviews lectureId={lecture.id} />
                  </section>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="w-[280px] xl:w-[320px] flex-shrink-0">
              <div className="sticky top-[110px]">
                {/* Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  {/* 기관명 + 모집중 뱃지 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#888888]">{lecture.organization}</span>
                    <div className={`h-5 px-2 rounded-full flex items-center justify-center gap-1 flex-shrink-0 ${
                      isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'
                      }`} />
                      <span className={`text-[10px] font-medium ${
                        isRecruiting ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {isRecruiting ? '모집중' : '모집마감'}
                      </span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-sm font-bold text-[#020202] leading-snug line-clamp-2 mt-2">{lecture.title}</h3>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200 my-4" />

                  {/* 정보 (라벨 + 값) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <span className="text-xs text-[#888888] w-16 flex-shrink-0">모집기간</span>
                      <span className="text-sm text-[#020202]">~{lecture.recruitDeadline}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-[#888888] w-16 flex-shrink-0">수업기간</span>
                      <span className="text-sm text-[#020202]">{lecture.periodStart} ~ {lecture.periodEnd}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-[#888888] w-16 flex-shrink-0">지역</span>
                      <span className="text-sm text-[#020202]">{lecture.region}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-[#888888] w-16 flex-shrink-0">수업시간</span>
                      <span className="text-sm text-[#020202]">{lecture.schedule}</span>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200 my-4" />

                  {/* 버튼들 */}
                  {lecture.applicationUrl ? (
                    <a
                      href={lecture.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 bg-[#262626] rounded-lg flex items-center justify-center mb-3 hover:bg-[#333333] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#FEB706]">신청페이지 바로가기</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full h-10 bg-gray-300 rounded-lg flex items-center justify-center mb-3 cursor-not-allowed"
                    >
                      <span className="text-sm font-medium text-gray-500">신청 URL 준비중</span>
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsInCart(!isInCart)}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
                        {isInCart ? '관심등록됨' : '관심등록'}
                      </span>
                    </button>
                    <button
                      onClick={handleGoToCompare}
                      className="flex-1 h-10 bg-[#FEB706] rounded-lg flex items-center justify-center hover:bg-[#E5A605] transition-colors"
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
      <PCCartSidebar
        items={cartItems}
        onRemove={(id) => removeFromCart(id)}
        onCompare={handleGoToCompare}
      />

      {/* ==================== 모바일 레이아웃 (lg 미만) ==================== */}
      <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
      {/* Hero Image */}
      <div className="w-full h-[250px] relative">
        {lecture.thumbnailUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${lecture.thumbnailUrl})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">대표 이미지</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full px-4 py-[30px] flex flex-col gap-6">
        {/* Header: Organization + Status */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#555555]">{lecture.organization}</span>
            <div className={`h-5 px-2 rounded-full flex items-center justify-center gap-1 ${
              isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'
              }`} />
              <span className={`text-[10px] font-medium ${
                isRecruiting ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {isRecruiting ? '모집중' : '모집마감'}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#020202] leading-tight">{lecture.title}</h1>
        </div>

        {/* Quick Info */}
        <div className="p-[10px] border-t border-b border-gray-200 flex flex-col gap-3">
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#888888] w-[50px] flex-shrink-0">모집기간</span>
            <span className="text-xs font-semibold text-black">~{lecture.recruitDeadline}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#888888] w-[50px] flex-shrink-0">수업기간</span>
            <span className="text-xs font-semibold text-black">{lecture.periodStart} ~ {lecture.periodEnd}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#888888] w-[50px] flex-shrink-0">지역</span>
            <span className="text-xs font-semibold text-black">{lecture.region}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#888888] w-[50px] flex-shrink-0">수업시간</span>
            <span className="text-xs font-semibold text-black">{lecture.schedule}</span>
          </div>
        </div>

        {/* Header placeholder - 고정 위치 감지용 */}
        <div ref={headerPlaceholderRef} className={isHeaderFixed ? 'h-[140px]' : 'h-0'} />

        {/* Action Buttons + Tab Navigation */}
        <div
          ref={headerRef}
          className={`
            ${isHeaderFixed ? 'fixed top-0 left-0 right-0 pt-0' : '-mx-4 pt-2'}
            z-40 bg-white px-4 pb-0 shadow-md border-b border-gray-100
          `}
        >
          {/* Action Buttons */}
          <div className={`flex flex-col gap-2 mb-2 ${isHeaderFixed ? 'max-w-[360px] mx-auto' : ''}`}>
            {lecture.applicationUrl ? (
              <a
                href={lecture.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-[#262626] rounded-lg flex items-center justify-center"
              >
                <span className="text-xs text-[#FEB706]">신청페이지 바로가기</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full h-10 bg-gray-300 rounded-lg flex items-center justify-center cursor-not-allowed"
              >
                <span className="text-xs text-gray-500">신청 URL 준비중</span>
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setIsInCart(!isInCart)}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-1 ${
                  isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'
                }`}
              >
                {isInCart && <Check className="w-3 h-3 text-[#FEB706]" />}
                <span className={`text-xs font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
                  {isInCart ? '관심등록됨' : '관심등록'}
                </span>
              </button>
              <button
                onClick={handleGoToCompare}
                className="flex-1 h-10 bg-[#FEB706] rounded-lg flex items-center justify-center"
              >
                <span className="text-xs font-medium text-[#404040]">비교하기</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={`border-b border-gray-200 flex ${isHeaderFixed ? 'max-w-[360px] mx-auto' : ''}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex-1 py-3 flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#FEB706] font-semibold'
                  : ''
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
        <section id="mobile-overview" className="pb-6 border-b border-gray-200 flex flex-col gap-6 scroll-mt-40">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">프로그램 요약</span>
            <div className="px-3 py-1 bg-gradient-to-r from-[#FFF4D8] to-[#FACC5A] rounded-full border border-[#FEB706] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-black" />
              <span className="text-xs text-[#020202]">AI 요약</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[#555555]">
              <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.location}</span>에서{' '}
              <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.schedule}</span>
            </p>
            <p className="text-sm text-[#555555]">
              으로 진행되는{' '}
              <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.type}</span>{' '}
              <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.category}</span> 과정입니다.
            </p>
            <p className="text-sm text-[#555555]">
              주요 서비스로{' '}
              <span className="font-semibold text-[#020202] underline">{lecture.aiSummary.services}</span>
            </p>
            <p className="text-sm text-[#555555]">
              등을 제공하며, 선발절차에 코딩테스트는{' '}
              <span className="font-semibold text-[#020202] underline">
                {lecture.aiSummary.hasCodingTest ? '있습니다.' : '없습니다.'}
              </span>
            </p>
          </div>
        </section>

        {/* Section: 교육기관 정보 */}
        <section id="mobile-intro" className="pb-6 border-b border-gray-200 flex flex-col gap-6 scroll-mt-40">
          <SectionHeader icon={<Building2 />} title="교육기관 정보" />
          <InfoCard
            icon={<Building2 />}
            title={lecture.organization}
            description={lecture.organizationDescription}
            action={
              <button className="h-8 lg:h-10 px-4 lg:px-6 bg-[#EEEEEE] rounded-lg flex items-center justify-center hover:bg-[#E0E0E0] transition-colors">
                <span className="text-xs lg:text-sm text-[#020202]">자세히 보기</span>
              </button>
            }
          />
        </section>

        {/* Section: 일정 & 수업 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FEB706]" />
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
                <span className="text-sm font-semibold text-black">{lecture.periodStart} ~ {lecture.periodEnd}</span>
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
                <span className="text-sm font-semibold text-black">{lecture.totalDays}일({lecture.totalHours.toLocaleString()}시간)</span>
              </div>
            )}
          </div>
        </section>

        {/* Section: 수강료 & 지원금 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#FEB706]" />
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
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <SectionHeader icon={<UserCheck />} title="지원 자격을 확인해주세요." />
          <QualificationsSection
            required={lecture.qualifications.required}
            preferred={lecture.qualifications.preferred}
          />
        </section>

        {/* Section: 지원 절차 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">이런 절차로 지원할 수 있어요.</span>
          </div>
          {lecture.applicationSteps.length > 0 ? (
            <div className="flex items-center gap-3 flex-wrap">
              {lecture.applicationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-[#FFFCF4] rounded-lg border border-[#FEB706]">
                    <span className="text-sm text-black">{step}</span>
                  </div>
                  {idx < lecture.applicationSteps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-[#FEB706]" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-[#888888]">지원 절차 정보가 없습니다.</span>
          )}
        </section>

        {/* Section: 학습 공간 사진 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">학습 공간 사진</span>
          </div>
          {lecture.photos.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto">
              {lecture.photos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`학습 공간 ${idx + 1}`} className="w-[200px] h-[138px] rounded-lg object-cover" />
              ))}
            </div>
          ) : (
            <span className="text-sm text-[#888888]">학습 공간 사진 정보가 없습니다.</span>
          )}
        </section>

        {/* Section: 추가 제공 항목 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">추가 제공 항목</span>
          </div>
          {lecture.additionalItems.length > 0 ? (
            <span className="text-sm text-[#020202]">
              {lecture.additionalItems.join(', ')}
            </span>
          ) : (
            <span className="text-sm text-[#888888]">추가 제공 항목 정보가 없습니다.</span>
          )}
        </section>

        {/* Section: 훈련 목표 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">훈련 목표</span>
          </div>
          {lecture.goals.length > 0 ? (
            <div className="flex flex-col gap-3">
              {lecture.goals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#EEEEEE] rounded-full flex items-center justify-center flex-shrink-0">
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
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
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
            <span className="text-sm text-[#888888]">강사진 소개 정보가 없습니다.</span>
          )}
        </section>

        {/* Section: 지원 서비스 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <SectionHeader icon={<Briefcase />} title="지원 서비스" />
          <ServiceGrid services={lecture.services} />
        </section>

        {/* Section: 프로젝트 정보 */}
        <section className="pb-6 border-b border-gray-200 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">프로젝트 정보</span>
          </div>
          {(lecture.project.count > 0 || lecture.project.duration || lecture.project.teamComposition || lecture.project.tools.length > 0) ? (
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
                  <Check className={`w-[14px] h-[14px] ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${lecture.project.hasMentor ? 'text-[#6EC353]' : 'text-gray-400'}`}>
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
        <section id="mobile-curriculum" className="pb-6 border-b border-gray-200 flex flex-col gap-6 scroll-mt-40">
          <button
            onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
            className="w-full flex justify-between items-center"
          >
            <SectionHeader icon={<BookOpen />} title="커리큘럼" />
            <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-black transition-transform ${isCurriculumOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCurriculumOpen && (
            lecture.curriculum.length > 0 ? (
              <div className="bg-white rounded-xl shadow-[4px_4px_15px_rgba(161,161,170,0.25)] overflow-hidden border border-gray-100">
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
            )
          )}
        </section>

        {/* Section: 후기 */}
        <section id="mobile-review" className="pb-6 border-b border-gray-200 flex flex-col gap-6 scroll-mt-40">
          <LectureReviews lectureId={lecture.id} />
        </section>

        {/* 플로팅 바 공간 확보 */}
        <div className="h-[100px]" />
      </div>

      {/* 하단 플로팅 관심 항목 바 (모바일 전용) */}
      <FloatingInterestBar
        items={cartItems}
        onRemove={(id) => removeFromCart(id)}
        onCompare={handleGoToCompare}
        isOpen={isFloatingBarOpen}
        onToggleOpen={() => setIsFloatingBarOpen(prev => !prev)}
      />
      </div>
    </>
  )
}
