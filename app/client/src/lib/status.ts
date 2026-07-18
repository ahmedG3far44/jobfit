export const STATUSES = [
  { value: 'Application Viewed', label: 'Application Viewed', color: '#6b7280' },
  { value: 'Shortlisted', label: 'Shortlisted', color: '#3b82f6' },
  { value: 'HR Screening', label: 'HR Screening', color: '#ec4899' },
  { value: 'Recruiter Call', label: 'Recruiter Call', color: '#8b5cf6' },
  { value: 'Online Assessment', label: 'Online Assessment', color: '#a855f7' },
  { value: 'Home Task', label: 'Home Task', color: '#f97316' },
  { value: 'Technical Interview 1', label: 'Technical Interview 1', color: '#06b6d4' },
  { value: 'Technical Interview 2', label: 'Technical Interview 2', color: '#6366f1' },
  { value: 'System Design Interview', label: 'System Design Interview', color: '#14b8a6' },
  { value: 'Hiring Manager Interview', label: 'Hiring Manager Interview', color: '#0ea5e9' },
  { value: 'Final Interview', label: 'Final Interview', color: '#f59e0b' },
  { value: 'Reference Check', label: 'Reference Check', color: '#84cc16' },
  { value: 'Offer Extended', label: 'Offer Extended', color: '#10b981' },
  { value: 'Offer Accepted', label: 'Offer Accepted', color: '#22c55e' },
  { value: 'No Response', label: 'No Response', color: '#9ca3af' },
  { value: 'Rejected', label: 'Rejected', color: '#ef4444' },
  { value: 'Offer Declined', label: 'Offer Declined', color: '#f43f5e' },
  { value: 'Withdrawn', label: 'Withdrawn', color: '#d946ef' },
  { value: 'Hired', label: 'Hired', color: '#16a34a' },
] as const

export type VersionStatus = typeof STATUSES[number]['value']

export function getStatusConfig(status: string) {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0]
}
