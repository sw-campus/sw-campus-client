import { api } from '@/lib/axios'

export interface TeacherResponse {
  teacherId: number
  teacherName: string
  teacherDescription: string | null
  teacherImageUrl: string | null
}

export const searchTeachers = async (name: string): Promise<TeacherResponse[]> => {
  if (!name.trim()) {
    return []
  }
  const { data } = await api.get<TeacherResponse[]>('/teachers', {
    params: { name: name.trim() },
  })
  return data
}
