import { useQuery } from '@tanstack/react-query'

import { getCurriculumsByCategoryId } from '@/features/category/api/category.api'
import type { CurriculumResponse } from '@/features/category/types/category.type'

export const useCurriculumsByCategoryId = (categoryId: number | null) => {
    return useQuery<CurriculumResponse[], unknown>({
        queryKey: ['categories', categoryId, 'curriculums'],
        queryFn: () => getCurriculumsByCategoryId(categoryId!),
        enabled: !!categoryId,
    })
}
