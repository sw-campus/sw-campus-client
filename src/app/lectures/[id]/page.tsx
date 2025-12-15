import { LectureDetailPage } from '@/features/lecture/components/LectureDetailPage'

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  return <LectureDetailPage lectureId={params.id} />
}
