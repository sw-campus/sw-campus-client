import LectureDetailPage from '@/features/lecture/components/LectureDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  return <LectureDetailPage lectureId={params.id} />
}
