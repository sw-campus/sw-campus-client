import { useQuery } from '@tanstack/react-query'

import { getCategoryTree } from '@/features/category/api/category.api'
import type { CategoryTreeNode } from '@/features/category/types/category.type'

export const useCategoryTree = () => {
    return useQuery<CategoryTreeNode[], unknown>({
        queryKey: ['categories', 'tree'],
        queryFn: getCategoryTree,
    })
}
