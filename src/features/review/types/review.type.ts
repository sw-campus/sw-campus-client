export type Review = {
  id: string
  title: string
  description: string
  rating: number
  author: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}
