export interface CategoryTreeNode {
    categoryId: number
    categoryName: string
    sort: number
    children: CategoryTreeNode[]
}

export interface CurriculumResponse {
    curriculumId: number
    categoryId: number
    curriculumName: string
}

export type CurriculumLevel = 'NONE' | 'BASIC' | 'ADVANCED'
