export const LECTURE_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

export type LectureDayValue = (typeof LECTURE_DAYS)[number]
