import { api } from '@/lib/axios'

const LECTURE_FILE_UPLOAD_PATH = '/files'

export const uploadLectureFile = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post(LECTURE_FILE_UPLOAD_PATH, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const data = res.data as unknown

  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const url = record.url ?? record.fileUrl ?? record.path
    if (typeof url === 'string') return url
  }

  throw new Error('Unexpected upload response')
}
