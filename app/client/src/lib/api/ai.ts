import { api } from './client'
import type { WritingStyle } from '@/lib/writing-styles'

export const aiApi = {
  fitResume: (data: { resumeId: string; jobDescription: string; customInstructions?: string; a4Optimized?: boolean }, token: string) =>
    api.post<{ aiContent: string }>('/ai/fit-resume', data, token),

  generateCoverLetter: (data: {
    resumeContent: string
    jobDescription: string
    company: string
    jobTitle: string
    style?: WritingStyle
  }, token: string) => api.post<{ content: string }>('/ai/cover-letter', data, token),
}
