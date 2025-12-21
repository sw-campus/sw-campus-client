import { api } from '@/lib/axios'

export interface TeacherResponse {
  teacherId: number
  teacherName: string
  teacherDescription: string | null
  teacherImageUrl: string | null
}

export const searchTeachers = async (name: string): Promise<TeacherResponse[]> => {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return []
  }

  const { data } = await api.get<TeacherResponse[]>('/teachers', {
    params: { name: trimmedName },
  })
  return data
}
