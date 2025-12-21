'use client'

import { useQuery } from '@tanstack/react-query'

import { searchTeachers, type TeacherResponse } from '@/features/lecture/api/teacherApi'

export function useSearchTeachersQuery(name: string, enabled = true) {
  return useQuery<TeacherResponse[]>({
    queryKey: ['teachers', 'search', name],
    queryFn: () => searchTeachers(name),
    enabled: enabled && name.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5분
  })
}
