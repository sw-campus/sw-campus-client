// User Profile API Types
// Backend response types from /api/v1/users

export interface ApiUserProfileResponse {
  userId: number
  nickname: string
  joinedAt: string
  postCount: number
  commentedPostCount: number
}

export interface UserProfile {
  userId: number
  nickname: string
  joinedAt: Date
  postCount: number
  commentedPostCount: number
}
