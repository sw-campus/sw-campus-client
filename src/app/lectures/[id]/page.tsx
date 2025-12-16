import LectureDetailPage from '@/features/lecture/components/LectureDetailPage'

export default async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const id = typeof resolvedParams.id === 'string' ? resolvedParams.id : await resolvedParams.id
  return <LectureDetailPage lectureId={id} />
}
