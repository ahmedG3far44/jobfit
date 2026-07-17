import { api } from './client'
import type { Resume } from '@/types'

export const resumesApi = {
  getAll: (token: string) => api.get<Resume[]>('/resumes', token),

  getById: (id: string, token: string) => api.get<Resume>(`/resumes/${id}`, token),

  create: (data: { title: string; parsedContent: string }, token: string) =>
    api.post<Resume>('/resumes', data, token),

  upload: (formData: FormData, token: string) =>
    api.upload<Resume>('/resumes', formData, token),

  update: (id: string, data: Partial<Resume>, token: string) =>
    api.patch<Resume>(`/resumes/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<{ message: string }>(`/resumes/${id}`, token),
}
