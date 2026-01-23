// 다음 환경변수가 없으면 에러 발생
const required = (value: string | undefined, key: string): string => {
  if (!value) throw new Error(`Missing env: ${key}`)
  return value
}

// 환경 판단
const NODE_ENV = required(process.env.NODE_ENV, 'NODE_ENV')
const isProd = NODE_ENV === 'production'
const isLocal = NODE_ENV === 'development'

export const env = {
  NODE_ENV,
  isProd,
  isLocal,

  NEXT_PUBLIC_API_URL: required(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL'),
}
