import { useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { X, Loader2, Check } from 'lucide-react'
import { parseResume } from '@/lib/resume-parser'
import type { User } from '@/types'

type PdfTemplate = 'minimal' | 'modern' | 'classic' | 'compact'

const TEMPLATES: { key: PdfTemplate; name: string; desc: string; style: string; sectionClass: string; bodyClass: string }[] = [
  {
    key: 'minimal',
    name: 'Minimal',
    desc: 'Clean Helvetica layout with simple section headers.',
    style: 'font-sans text-gray-900',
    sectionClass: 'font-bold uppercase tracking-wider text-[11px] border-b border-gray-300 pb-0.5 mb-1.5 text-gray-800',
    bodyClass: 'text-[11px] leading-relaxed',
  },
  {
    key: 'modern',
    name: 'Modern',
    desc: 'Blue section headers for visual flair.',
    style: 'font-sans text-gray-900',
    sectionClass: 'font-bold uppercase tracking-wider text-[11px] text-blue-600 border-b border-blue-300 pb-0.5 mb-1.5',
    bodyClass: 'text-[11px] leading-relaxed',
  },
  {
    key: 'classic',
    name: 'Classic',
    desc: 'Traditional Times New Roman with underlined titles.',
    style: 'font-serif text-gray-900',
    sectionClass: 'font-bold uppercase tracking-wider text-[11px] underline decoration-gray-400 pb-0.5 mb-1.5',
    bodyClass: 'text-[11px] leading-relaxed',
  },
  {
    key: 'compact',
    name: 'Compact',
    desc: 'Smaller fonts and tighter spacing for more content.',
    style: 'font-sans text-gray-900',
    sectionClass: 'font-bold uppercase tracking-wider text-[10px] border-b border-gray-300 pb-0.5 mb-1 text-gray-700',
    bodyClass: 'text-[10px] leading-snug',
  },
]

const CONTACT_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  portfolio: 'Portfolio',
  behance: 'Behance',
  other: 'Link',
}

function LargePreview({ content, template, user }: { content: string; template: typeof TEMPLATES[number]; user: Pick<User, 'name' | 'phone' | 'email' | 'contacts' | 'globalLocation' | 'localLocation'> | null }) {
  const parsed = useMemo(() => parseResume(content), [content])
  const sections = parsed.sections.filter((s) => s.content.trim() && s.name !== 'Contact')

  const locationParts: string[] = []
  if (user?.localLocation) locationParts.push(user.localLocation)
  if (user?.globalLocation) locationParts.push(user.globalLocation)
  const links = user?.contacts?.filter((c) => c.value) ?? []
  const hasLocation = locationParts.length > 0
  const hasPhone = !!user?.phone
  const hasEmail = !!user?.email
  const hasLinks = links.length > 0

  return (
    <div className={`${template.style} h-full w-full overflow-y-auto rounded-lg border bg-white p-5 shadow-inner`}>
      {user?.name && (
        <div className="mb-4 pb-3 border-b border-gray-300">
          <div className="text-lg font-bold">{user.name}</div>
          {(hasLocation || hasPhone || hasEmail || hasLinks) && (
            <div className="mt-1 text-[10px] text-gray-500">
              {hasLocation && <span>{locationParts.join(', ')}</span>}
              {hasLocation && (hasPhone || hasEmail || hasLinks) && <span>  ·  </span>}
              {hasPhone && <span>{user.phone}</span>}
              {hasPhone && (hasEmail || hasLinks) && <span>  ·  </span>}
              {hasEmail && <span>{user.email}</span>}
              {hasEmail && hasLinks && <span>  ·  </span>}
              {links.map((c, i) => (
                <span key={i}>
                  {i > 0 ? '  ·  ' : ''}
                  <a href={c.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{CONTACT_LABELS[c.type] || c.type}</a>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {sections.length === 0 && !user?.name ? (
        <p className="text-sm text-gray-400 italic">No content to preview</p>
      ) : (
        sections.map((s) => (
          <div key={s.name} className="mb-3 last:mb-0">
            <div className={template.sectionClass}>{s.name}</div>
            <div className={template.bodyClass}>
              {s.content.split('\n').map((line, i) => (
                <div key={i}>{line || '\u00A0'}</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export function ExportPdfModal({
  content,
  filename,
  user,
  onClose,
}: {
  content: string
  filename?: string
  user: Pick<User, 'name' | 'phone' | 'email' | 'contacts' | 'globalLocation' | 'localLocation'> | null
  onClose: () => void
}) {
  const { token } = useAuth()
  const [selected, setSelected] = useState<PdfTemplate>('minimal')
  const [exporting, setExporting] = useState(false)

  const selectedTemplate = TEMPLATES.find((t) => t.key === selected)!

  const handleExport = async () => {
    if (!token) return
    setExporting(true)
    try {
      await api.download(
        '/export/pdf',
        { content, filename: filename || 'Optimized Resume', template: selected, user },
        token,
        `${filename || 'optimized-resume'}.pdf`,
      )
      onClose()
    } catch {
      // silent
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 flex h-[85vh] w-[80vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Export as PDF</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="flex flex-col border-b md:w-[280px] md:shrink-0 md:border-b-0 md:border-r">
            <div className="flex-1 space-y-1 overflow-y-auto p-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelected(t.key)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    selected === t.key
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.name}</span>
                    {selected === t.key && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t p-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" className="flex-1" onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  'Download PDF'
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden p-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Preview: <span className="font-medium text-foreground">{selectedTemplate.name}</span>
            </p>
            <div className="flex-1 overflow-hidden rounded-lg border">
              <LargePreview content={content} template={selectedTemplate} user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
