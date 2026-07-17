import { api } from './client'
import type { ResumeVersion } from '@/types'

export const versionsApi = {
  getAll: (token: string) => api.get<ResumeVersion[]>('/versions', token),

  getById: (id: string, token: string) => api.get<ResumeVersion>(`/versions/${id}`, token),

  create: (data: {
    resumeId: string
    name: string
    company: string
    jobTitle: string
    jobDescription: string
    aiContent: string
  }, token: string) => api.post<ResumeVersion>('/versions', data, token),

  update: (id: string, data: Partial<ResumeVersion>, token: string) =>
    api.patch<ResumeVersion>(`/versions/${id}`, data, token),

  delete: (id: string, token: string) =>
    api.delete<{ message: string }>(`/versions/${id}`, token),
}
