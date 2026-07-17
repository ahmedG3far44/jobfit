import { STATUSES, getStatusConfig } from '@/lib/status'
import type { VersionStatus } from '@/types'

interface StatusDropdownProps {
  value: VersionStatus
  onChange: (value: VersionStatus) => void
}

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const config = getStatusConfig(value)

  return (
    <div className="relative inline-flex items-center gap-2 rounded-lg border border-input bg-card px-2.5 py-1.5 shadow-sm">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as VersionStatus)}
        onClick={(e) => e.stopPropagation()}
        className="appearance-none bg-transparent pr-4 text-sm font-medium cursor-pointer focus:outline-none"
        style={{ color: config.color }}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3"
        style={{ color: config.color }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}
