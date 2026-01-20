// Board Category API Types
// Backend response types from /api/v1/board-categories

export interface ApiBoardCategory {
  id: number
  name: string
  children: ApiBoardCategory[]
}

// Frontend types (same structure for now)
export interface BoardCategory {
  id: number
  name: string
  children: BoardCategory[]
}

// Mapper function
export function mapApiBoardCategoryToBoardCategory(api: ApiBoardCategory): BoardCategory {
  return {
    id: api.id,
    name: api.name,
    children: api.children.map(mapApiBoardCategoryToBoardCategory),
  }
}
