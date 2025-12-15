/**
 * 수강생 후기 타입
 */
export interface Review {
    id: number;
    quote: string;
    description: string;
    author: string;
    role: string;
}

/**
 * 수강생 후기 Mock 데이터
 */
export const MOCK_REVIEWS: Review[] = [
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
