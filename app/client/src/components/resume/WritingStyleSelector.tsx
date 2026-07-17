import { WRITING_STYLES, type WritingStyle } from '@/lib/writing-styles'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function WritingStyleSelector({
  value,
  onChange,
  disabled,
}: {
  value: WritingStyle
  onChange: (style: WritingStyle) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {WRITING_STYLES.map((style) => (
        <button
          key={style.key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(style.key)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            value === style.key
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {value === style.key && <Check className="h-3 w-3" />}
          {style.label}
        </button>
      ))}
    </div>
  )
}
