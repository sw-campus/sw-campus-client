"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CourseCard } from '@/features/course/components/CourseCard';
import type { Organization } from '../types/organization.type';
import type { Course } from '@/features/course/types/course.type';

interface OrganizationDetailProps {
    organization: Organization;
    courses?: Course[];
}

// Tab types
type TabValue = 'intro' | 'reviews' | 'programs';

const TABS: { value: TabValue; label: string }[] = [
    { value: 'intro', label: '기관 소개' },
    { value: 'reviews', label: '수강생 후기' },
    { value: 'programs', label: '모집 중인 프로그램' },
];

// Mock reviews for the organization
const MOCK_REVIEWS = [
    {
        id: 1,
        quote: "비전공자였지만 6개월 만에 개발자로 취업했어요!",
        description: "처음에는 코딩이 막막했는데, 기초부터 탄탄하게 잡아주는 커리큘럼 덕분에 끝까지 따라갈 수 있었습니다.",
        author: "김OO",
        role: "프론트엔드 개발자 취업",
    },
    {
        id: 2,
        quote: "실무 프로젝트 경험이 취업에 결정적이었습니다.",
        description: "실제 기업 협업 프로젝트를 통해 현장 감각을 익힐 수 있었습니다. 협업하는 방식도 배웠어요.",
        author: "이OO",
        role: "백엔드 개발자 취업",
    },
    {
        id: 3,
        quote: "커리어 코칭 덕분에 제게 맞는 회사를 찾았어요.",
        description: "이력서 첨삭부터 모의 면접까지, 취업 준비의 A to Z를 도와주셨습니다.",
        author: "박OO",
        role: "데이터 분석가 취업",
    },
    {
        id: 4,
        quote: "현업 멘토님의 코드 리뷰가 큰 도움이 되었습니다.",
        description: "단순히 동작하는 코드가 아닌, 좋은 코드를 작성하는 방법을 배울 수 있었어요.",
        author: "최OO",
        role: "풀스택 개발자 취업",
    },
    {
        id: 5,
        quote: "팀 프로젝트를 통해 협업 능력도 키웠어요.",
        description: "Git 협업, 코드 리뷰, 스프린트 관리 등 실무에서 바로 적용 가능한 경험을 쌓았습니다.",
        author: "정OO",
        role: "백엔드 개발자 취업",
    },
    {
        id: 6,
        quote: "수료 후에도 커뮤니티가 계속 유지돼요.",
        description: "동기들과 네트워킹하며 정보를 나누고, 선배 개발자분들의 조언도 들을 수 있어서 좋았습니다.",
        author: "강OO",
        role: "프론트엔드 개발자 취업",
    },
];

export function OrganizationDetail({ organization, courses = [] }: OrganizationDetailProps) {
    const [activeTab, setActiveTab] = useState<TabValue>('intro');

    // Collect facility images that exist
    const facilityImages = [
        organization.facilityImageUrl,
        organization.facilityImageUrl2,
        organization.facilityImageUrl3,
        organization.facilityImageUrl4,
    ].filter(Boolean) as string[];

    // Use first facility image as hero background, or a default
    const heroImage = facilityImages[0] || `https://picsum.photos/seed/${organization.id}/1200/400`;

    return (
        <div className="w-full">
            {/* ===== HERO BANNER ===== */}
            <div className="relative -mx-6 -mt-6 mb-8 h-56 overflow-hidden rounded-t-xl md:h-72">
                <Image
                    src={heroImage}
                    alt={`${organization.name} 배경`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {/* Logo */}
                    <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white/20 md:h-24 md:w-24">
                        {organization.logoUrl || organization.imageUrl ? (
                            <Image
                                src={organization.logoUrl || organization.imageUrl || ''}
                                alt={organization.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-contain p-2"
                            />
                        ) : (
                            <span className="text-4xl">🏢</span>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="mb-4 text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
                        {organization.name}
                    </h1>

                    {/* Homepage Button */}
                    <Link
                        href="#"
                        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:scale-105"
                    >
                        홈페이지 바로가기
                    </Link>
                </div>
            </div>

            {/* ===== PILL TABS (CourseFilterTabs style) ===== */}
            <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto whitespace-nowrap">
                {TABS.map((tab) => {
                    const isActive = tab.value === activeTab;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-foreground text-background shadow-md'
                                    : 'bg-card/60 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===== TAB CONTENT ===== */}
            <div className="pb-20">
                {/* 기관 소개 */}
                {activeTab === 'intro' && (
                    <div className="space-y-10">
                        {/* Facility Images */}
                        {facilityImages.length > 0 && (
                            <section>
                                <h2 className="mb-5 text-xl font-bold text-foreground">
                                    {organization.name}의 현장이에요.
                                </h2>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                    {facilityImages.map((url, index) => (
                                        <div
                                            key={index}
                                            className="group aspect-square overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-200 hover:shadow-lg"
                                        >
                                            <Image
                                                src={url}
                                                alt={`${organization.name} 현장 이미지 ${index + 1}`}
                                                width={400}
                                                height={400}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Philosophy */}
                        <section>
                            <h2 className="mb-5 text-xl font-bold text-foreground">
                                이런 철학으로 운영해요
                            </h2>
                            <Card className="border-0 bg-card/40 p-6 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md md:p-8">
                                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
                                    {organization.description || organization.desc}
                                </p>
                            </Card>
                        </section>
                    </div>
                )}

                {/* 수강생 후기 */}
                {activeTab === 'reviews' && (
                    <section>
                        <h2 className="mb-6 text-xl font-bold text-foreground">
                            수강생 분들의 솔직한 후기예요.
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {MOCK_REVIEWS.map((review) => (
                                <Card
                                    key={review.id}
                                    className="group flex flex-col justify-between border-0 bg-card/40 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                                >
                                    <div>
                                        {/* Quote mark */}
                                        <span className="mb-2 block text-4xl leading-none text-primary/30 font-serif select-none">
                                            "
                                        </span>
                                        {/* Quote text */}
                                        <h3 className="mb-3 text-base font-bold leading-snug text-foreground">
                                            {review.quote}
                                        </h3>
                                        {/* Description */}
                                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                            {review.description}
                                        </p>
                                    </div>
                                    {/* Author */}
                                    <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{review.author}</p>
                                            <p className="text-xs text-muted-foreground">{review.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* 모집 중인 프로그램 */}
                {activeTab === 'programs' && (
                    <section>
                        {courses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <Card className="flex h-60 flex-col items-center justify-center border-0 bg-card/40 text-center shadow-sm backdrop-blur-xl">
                                <div className="mb-3 text-4xl">📚</div>
                                <p className="text-lg font-medium text-foreground">현재 모집 중인 프로그램이 없습니다.</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    추후 새로운 프로그램이 개설되면 업데이트됩니다.
                                </p>
                            </Card>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
