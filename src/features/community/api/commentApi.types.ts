// Comment API Types

export interface Comment {
  id: number
  postId: number
  parentId: number | null
  authorId: number
  authorNickname: string
  body: string
  imageUrl: string | null
  likeCount: number
  createdAt: Date
  updatedAt: Date
  isAuthor: boolean
  isLiked: boolean
  replies: Comment[]
}

export interface ApiCommentResponse {
  id: number
  postId: number
  parentId: number | null
  authorId: number
  authorNickname: string
  body: string
  imageUrl: string | null
  likeCount: number
  createdAt: string
  updatedAt: string
  isAuthor: boolean
  isLiked: boolean
  replies: ApiCommentResponse[]
}

export interface CreateCommentRequest {
  postId: number
  parentId?: number | null
  body: string
  imageUrl?: string | null
}

export interface UpdateCommentRequest {
  body: string
  imageUrl?: string | null
}

// API Response를 Frontend 타입으로 변환
export function mapApiComment(api: ApiCommentResponse): Comment {
  return {
    id: api.id,
    postId: api.postId,
    parentId: api.parentId,
    authorId: api.authorId,
    authorNickname: api.authorNickname,
    body: api.body,
    imageUrl: api.imageUrl,
    likeCount: api.likeCount,
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
    isAuthor: api.isAuthor,
    isLiked: api.isLiked,
    replies: api.replies.map(mapApiComment),
  }
}
