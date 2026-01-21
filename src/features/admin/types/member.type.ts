export type MemberRole = 'USER' | 'ADMIN' | 'ORGANIZATION'
export type MemberRoleFilter = 'ALL' | MemberRole

export interface MemberSummary {
  id: number
  email: string
  name: string
  nickname: string
  phone: string
  role: MemberRole
}
