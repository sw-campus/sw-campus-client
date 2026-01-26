export interface Banner {
  id: number
  imageUrl: string
  title?: string
  link?: string
}

export interface Course {
  id: number
  title: string
  category: string
  organization?: string
  thumbnailUrl?: string
}

export interface Bootcamp {
  id: number
  title: string
  organization: string
  category: string
  rating: number
  reviewCount: number
  isRecruiting: boolean
  thumbnailUrl?: string
}

export interface Partner {
  id: number
  name: string
  logoUrl?: string
}

export interface Event {
  id: number
  title: string
  imageUrl: string
  link?: string
}
