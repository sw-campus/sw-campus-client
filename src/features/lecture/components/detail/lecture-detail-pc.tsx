'use client'

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
import Link from 'next/link'

import {
  SectionHeader,
  CurriculumItem,
  ServiceGrid,
  QualificationsSection,
  InfoCard,
} from '@/features/bootcamp-list'

import LectureReviews from './lecture-reviews'
import { formatCurrency, tabs, type LectureUIData, type TabType } from './map-lecture-ui-data'

interface LectureDetailPCProps {
  lecture: LectureUIData
  activeTab: TabType
  isCurriculumOpen: boolean
  isInCart: boolean
  mainContentRef: React.RefObject<HTMLDivElement | null>
  heroRef: React.RefObject<HTMLDivElement | null>
  onTabClick: (tabId: TabType) => void
  onCurriculumToggle: () => void
  onCartToggle: () => void
  onGoToCompare: () => void
}

export function LectureDetailPC({
  lecture,
  activeTab,
  isCurriculumOpen,
  isInCart,
  mainContentRef,
  heroRef,
  onTabClick,
  onCurriculumToggle,
  onCartToggle,
  onGoToCompare,
}: LectureDetailPCProps) {
  const isRecruiting = lecture.status === 'RECRUITING'

  return (
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
                      onClick={() => onTabClick(tab.id)}
                      className={`flex flex-1 items-center justify-center gap-2 py-4 text-base transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-[#FEB706] font-semibold text-[#020202]'
                          : 'text-[#888888] hover:text-[#555555]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.id === 'review' && lecture.reviewCount > 0 && (
                        <span className="text-sm text-[#888888]">({lecture.reviewCount.toLocaleString()})</span>
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
                      <Link
                        href={`/organizations/${lecture.organizationId}`}
                        className="flex h-8 items-center justify-center rounded-lg bg-[#EEEEEE] px-4 transition-colors hover:bg-[#E0E0E0] lg:h-10 lg:px-6"
                      >
                        <span className="text-xs text-[#020202] lg:text-sm">자세히 보기</span>
                      </Link>
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
                    onClick={onCurriculumToggle}
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
                    onClick={onCartToggle}
                    className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg transition-colors ${
                      isInCart ? 'bg-[#262626]' : 'bg-[#FFFCF4]'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isInCart ? 'text-[#FEB706]' : 'text-[#020202]'}`}>
                      {isInCart ? '관심등록됨' : '관심등록'}
                    </span>
                  </button>
                  <button
                    onClick={onGoToCompare}
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
  )
}
