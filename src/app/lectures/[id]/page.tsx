import LectureDetailPage from '@/features/lecture/components/LectureDetailPage'

export default async function Page({ params }: { params: { id: string } }) {
  // params가 Promise일 수 있으므로 안전하게 언래핑
  const resolvedParams = await params
  const id = typeof resolvedParams.id === 'string' ? resolvedParams.id : await resolvedParams.id
  return <LectureDetailPage lectureId={id} />
}
