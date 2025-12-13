import { Organization } from '../types/organization.type';

const COMMON_LOGO = "https://boottent.com/_next/image?url=https%3A%2F%2Fcdn.sayun.studio%2Fboottent%2Ffiles%2Fcompany%2Fcover%2Fintroduction_dedddcb7-b77b-4015-8b47-849f237a4e45.png&w=128&q=75";

export const MOCK_ORGS: Organization[] = [
    {
        id: 1,
        name: "멋쟁이사자처럼",
        desc: "국내 최대 IT 교육 스타트업으로, 코딩 교육과 창업 지원을 통해 누구나 아이디어를 실현할 수 있도록 돕습니다.",
        activeCourseCount: 3,
        imageUrl: COMMON_LOGO,
    },
    {
        id: 2,
        name: "원티드랩",
        desc: "AI 기반 채용 플랫폼 '원티드'를 운영하며, 실무 중심의 부트캠프 프로그램을 제공합니다.",
        activeCourseCount: 1,
        imageUrl: COMMON_LOGO,
    },
    {
        id: 3,
        name: "코드스테이츠",
        desc: "소프트웨어 엔지니어링, 데이터 사이언스 등 IT 분야의 실무 중심 교육을 제공하는 부트캠프입니다.",
        activeCourseCount: 5,
        imageUrl: COMMON_LOGO,
    },
    {
        id: 4,
        name: "멀티캠퍼스",
        desc: "삼성 계열 IT 교육 전문기관으로, 다양한 기술 분야의 체계적인 교육 프로그램을 운영합니다.",
        activeCourseCount: 0,
        imageUrl: COMMON_LOGO,
    },
    {
        id: 5,
        name: "패스트캠퍼스",
        desc: "실무에 필요한 IT, 비즈니스, 디자인 등 다양한 분야의 온오프라인 강의를 제공합니다.",
        activeCourseCount: 2,
        imageUrl: COMMON_LOGO,
    },
    {
        id: 6,
        name: "한국경제신문",
        desc: "대한민국 대표 경제 신문사로, 디지털 전환 시대에 필요한 다양한 교육 프로그램을 운영합니다.",
        activeCourseCount: 4,
        imageUrl: COMMON_LOGO,
    },
];
