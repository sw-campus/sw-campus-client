import type { CategoryTreeNode, CurriculumResponse } from '@/features/category/types/category.type'
import { api } from '@/lib/axios'

export const getCategoryTree = async (): Promise<CategoryTreeNode[]> => {
    const res = await api.get('/categories/tree')
    return res.data
}

export const getCurriculumsByCategoryId = async (categoryId: number): Promise<CurriculumResponse[]> => {
    const res = await api.get(`/categories/${categoryId}/curriculums`)
    return res.data
}
