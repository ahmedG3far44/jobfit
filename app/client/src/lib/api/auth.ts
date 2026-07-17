import { api } from './client'
import type { AuthResponse, User, ContactLink } from '@/types'

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  logout: (token: string) =>
    api.post<{ message: string }>('/auth/logout', undefined, token),

  getMe: (token: string) =>
    api.get<{ user: User }>('/auth/me', token),

  updateProfile: (data: Partial<{ name: string; phone: string; contacts: ContactLink[]; globalLocation: string; localLocation: string }>, token: string) =>
    api.put<{ user: User }>('/auth/profile', data, token),

  uploadProfilePicture: (formData: FormData, token: string) =>
    api.upload<{ user: User }>('/auth/profile/picture', formData, token),
}
