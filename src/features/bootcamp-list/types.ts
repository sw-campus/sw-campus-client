export interface CourseInfo {
  title: string
  imageUrl: string
}

export interface AIComparison {
  recommendation: string
  description: string
  courseA: CourseInfo
  courseB: CourseInfo
}
