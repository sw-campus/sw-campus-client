import { Lecture } from '@/features/lecture/types/lecture.type'

export const mockLectures: Lecture[] = [
  {
    id: 'course-1',
    title: '프론트엔드 실전 웹 서비스 개발 Bootcamp',
    organization: '프로그래머스',
    periodStart: '2024-02-01',
    periodEnd: '2024-04-30',
    tags: [{ id: 'cat-web', name: '웹개발' }],
    imageUrl: 'https://picsum.photos/seed/web1/300/200',
  },
  {
    id: 'course-2',
    title: '모바일 앱 개발(Android/Kotlin) 실무 과정',
    organization: '패스트캠퍼스',
    periodStart: '2024-03-15',
    periodEnd: '2024-06-20',
    tags: [{ id: 'cat-mobile', name: '모바일' }],
    imageUrl: 'https://picsum.photos/seed/mobile2/300/200',
  },
  {
    id: 'course-3',
    title: 'Unity 기반 게임 개발 & 블록체인 연동 심화 과정',
    organization: '게임아카데미',
    periodStart: '2024-01-20',
    periodEnd: '2024-04-10',
    tags: [{ id: 'cat-game', name: '게임·블록체인' }],
    imageUrl: 'https://picsum.photos/seed/game3/300/200',
  },
  {
    id: 'course-4',
    title: 'AI 모델링 기반 데이터 분석 Bootcamp',
    organization: 'AI혁신센터',
    periodStart: '2024-01-10',
    periodEnd: '2024-03-01',
    tags: [{ id: 'cat-ai', name: '데이터·AI' }],
    imageUrl: 'https://picsum.photos/seed/ai4/300/200',
  },
]
