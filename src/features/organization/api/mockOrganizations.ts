import type { OrganizationSummary, OrganizationDetail } from '../types/organization.type'

const COMMON_LOGO =
  'https://boottent.com/_next/image?url=https%3A%2F%2Fcdn.sayun.studio%2Fboottent%2Ffiles%2Fcompany%2Fcover%2Fintroduction_dedddcb7-b77b-4015-8b47-849f237a4e45.png&w=128&q=75'
const FACILITY_IMAGE = 'https://picsum.photos/800/450'

/**
 * 기관 목록 Mock 데이터 (Summary)
 */
export const MOCK_ORGS: OrganizationSummary[] = [
  {
    id: 1,
    name: '멋쟁이사자처럼',
    description: '멋쟁이사자처럼은 대한민국 최대 규모의 IT 창업 동아리이자 교육 기관입니다.',
    recruitingLectureCount: 3,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 2,
    name: '원티드랩',
    description: "원티드랩은 AI 기반 채용 매칭 플랫폼 '원티드'를 운영하는 HR 테크 기업입니다.",
    recruitingLectureCount: 1,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 3,
    name: '코드스테이츠',
    description: '코드스테이츠는 IT 분야의 실무 중심 교육을 제공하는 부트캠프입니다.',
    recruitingLectureCount: 5,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 4,
    name: '멀티캠퍼스',
    description: '멀티캠퍼스는 삼성SDS의 교육 사업 부문에서 분사한 IT 교육 전문 기관입니다.',
    recruitingLectureCount: 0,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 5,
    name: '패스트캠퍼스',
    description: '패스트캠퍼스는 IT, 비즈니스, 디자인 등 다양한 분야의 온오프라인 강의를 제공합니다.',
    recruitingLectureCount: 2,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 6,
    name: '한국경제신문',
    description: '한국경제신문은 대한민국 대표 경제 전문 일간지로 다양한 IT 교육 프로그램을 운영합니다.',
    recruitingLectureCount: 4,
    logoUrl: COMMON_LOGO,
  },
]

/**
 * 기관 상세 Mock 데이터 (Detail)
 */
export const MOCK_ORG_DETAILS: OrganizationDetail[] = [
  {
    id: 1,
    userId: 1,
    name: '멋쟁이사자처럼',
    description:
      '멋쟁이사자처럼은 대한민국 최대 규모의 IT 창업 동아리이자 교육 기관입니다. 2013년에 설립되어 전국 대학교에서 운영되고 있으며, 비전공자도 쉽게 프로그래밍을 배울 수 있도록 체계적인 커리큘럼을 제공합니다.',
    certificateUrl: null,
    govAuth: 'K-Digital Training',
    facilityImageUrl: `${FACILITY_IMAGE}?random=1`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=2`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=3`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=4`,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 2,
    userId: 2,
    name: '원티드랩',
    description:
      "원티드랩은 AI 기반 채용 매칭 플랫폼 '원티드'를 운영하는 HR 테크 기업입니다. 채용 시장에서 쌓은 경험을 바탕으로 실무 중심의 부트캠프 프로그램을 제공하고 있습니다.",
    certificateUrl: null,
    govAuth: 'K-Digital Training',
    facilityImageUrl: `${FACILITY_IMAGE}?random=5`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=6`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=7`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=8`,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 3,
    userId: 3,
    name: '코드스테이츠',
    description:
      '코드스테이츠는 소프트웨어 엔지니어링, 데이터 사이언스, 프로덕트 매니지먼트 등 IT 분야의 실무 중심 교육을 제공하는 부트캠프입니다.',
    certificateUrl: null,
    govAuth: 'K-Digital Training',
    facilityImageUrl: `${FACILITY_IMAGE}?random=9`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=10`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=11`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=12`,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 4,
    userId: 4,
    name: '멀티캠퍼스',
    description:
      '멀티캠퍼스는 삼성SDS의 교육 사업 부문에서 분사한 IT 교육 전문 기관입니다. 30년 이상의 역사를 가진 국내 최고의 IT 교육 기관입니다.',
    certificateUrl: null,
    govAuth: null,
    facilityImageUrl: `${FACILITY_IMAGE}?random=13`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=14`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=15`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=16`,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 5,
    userId: 5,
    name: '패스트캠퍼스',
    description:
      "패스트캠퍼스는 '세상의 모든 직장인을 위한 실무 교육'을 슬로건으로 IT, 비즈니스, 디자인 등 다양한 분야의 온오프라인 강의를 제공합니다.",
    certificateUrl: null,
    govAuth: 'K-Digital Credit',
    facilityImageUrl: `${FACILITY_IMAGE}?random=17`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=18`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=19`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=20`,
    logoUrl: COMMON_LOGO,
  },
  {
    id: 6,
    userId: 6,
    name: '한국경제신문',
    description:
      '한국경제신문은 1964년 창간된 대한민국 대표 경제 전문 일간지입니다. 디지털 전환 시대에 발맞춰 다양한 IT 교육 프로그램을 운영합니다.',
    certificateUrl: null,
    govAuth: 'K-Digital Training',
    facilityImageUrl: `${FACILITY_IMAGE}?random=21`,
    facilityImageUrl2: `${FACILITY_IMAGE}?random=22`,
    facilityImageUrl3: `${FACILITY_IMAGE}?random=23`,
    facilityImageUrl4: `${FACILITY_IMAGE}?random=24`,
    logoUrl: COMMON_LOGO,
  },
]

/**
 * ID로 Mock 기관 상세 정보 찾기
 */
export function findMockOrgDetail(id: number): OrganizationDetail | undefined {
  return MOCK_ORG_DETAILS.find(org => org.id === id)
}

/**
 * 수강생 후기 타입
 */
export interface Review {
  id: number
  quote: string
  description: string
  author: string
  role: string
}

/**
 * 수강생 후기 Mock 데이터
 */
export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    quote: '비전공자였지만 6개월 만에 개발자로 취업했어요!',
    description: '처음에는 코딩이 막막했는데, 기초부터 탄탄하게 잡아주는 커리큘럼 덕분에 끝까지 따라갈 수 있었습니다.',
    author: '김OO',
    role: '프론트엔드 개발자 취업',
  },
  {
    id: 2,
    quote: '실무 프로젝트 경험이 취업에 결정적이었습니다.',
    description: '실제 기업 협업 프로젝트를 통해 현장 감각을 익힐 수 있었습니다. 협업하는 방식도 배웠어요.',
    author: '이OO',
    role: '백엔드 개발자 취업',
  },
  {
    id: 3,
    quote: '커리어 코칭 덕분에 제게 맞는 회사를 찾았어요.',
    description: '이력서 첨삭부터 모의 면접까지, 취업 준비의 A to Z를 도와주셨습니다.',
    author: '박OO',
    role: '데이터 분석가 취업',
  },
  {
    id: 4,
    quote: '현업 멘토님의 코드 리뷰가 큰 도움이 되었습니다.',
    description: '단순히 동작하는 코드가 아닌, 좋은 코드를 작성하는 방법을 배울 수 있었어요.',
    author: '최OO',
    role: '풀스택 개발자 취업',
  },
  {
    id: 5,
    quote: '팀 프로젝트를 통해 협업 능력도 키웠어요.',
    description: 'Git 협업, 코드 리뷰, 스프린트 관리 등 실무에서 바로 적용 가능한 경험을 쌓았습니다.',
    author: '정OO',
    role: '백엔드 개발자 취업',
  },
  {
    id: 6,
    quote: '수료 후에도 커뮤니티가 계속 유지돼요.',
    description: '동기들과 네트워킹하며 정보를 나누고, 선배 개발자분들의 조언도 들을 수 있어서 좋았습니다.',
    author: '강OO',
    role: '프론트엔드 개발자 취업',
  },
]
