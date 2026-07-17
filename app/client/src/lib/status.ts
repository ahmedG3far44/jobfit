export const STATUSES = [
  { value: 'applied', label: 'Applied', color: '#6b7280' },
  { value: 'screen interview', label: 'Screen Interview', color: '#3b82f6' },
  { value: 'technical interview', label: 'Technical Interview', color: '#06b6d4' },
  { value: 'assigned task', label: 'Assigned Task', color: '#8b5cf6' },
  { value: 'assigned assessment', label: 'Assigned Assessment', color: '#a855f7' },
  { value: 'HR interview', label: 'HR Interview', color: '#ec4899' },
  { value: 'tech interview -2', label: 'Tech Interview 2', color: '#6366f1' },
  { value: 'last interview', label: 'Last Interview', color: '#f97316' },
  { value: 'job offer', label: 'Job Offer', color: '#10b981' },
  { value: 'hired', label: 'Hired', color: '#22c55e' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
] as const

export type VersionStatus = typeof STATUSES[number]['value']

export function getStatusConfig(status: string) {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0]
}
