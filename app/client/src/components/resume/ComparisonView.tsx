import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { parseResume, findSection, computeDiffWords, type ResumeSection } from '@/lib/resume-parser'

const SECTIONS: { key: ResumeSection; label: string }[] = [
  { key: 'Summary', label: 'Summary' },
  { key: 'Skills', label: 'Skills' },
  { key: 'Experience', label: 'Experience' },
  { key: 'Projects', label: 'Projects' },
  { key: 'Education', label: 'Education' },
]

function highlightAddedWords(text: string, addedWords: Set<string>): (string | { text: string; highlight: boolean })[] {
  return text.split(/(\s+)/).map((word) => {
    const clean = word.replace(/[^a-zA-Z0-9+#.-]/g, '').toLowerCase()
    return addedWords.has(clean) && word.trim().length > 0
      ? { text: word, highlight: true }
      : word
  })
}

function SectionRow({ label, original, optimized, addedWords }: {
  label: string
  original: string
  optimized: string
  addedWords: Set<string>
}) {
  const hasOriginal = original.length > 0
  const hasOptimized = optimized.length > 0

  if (!hasOriginal && !hasOptimized) return null

  const tokens = highlightAddedWords(optimized, addedWords)

  return (
    <div className="border-b last:border-b-0">
      <div className="bg-muted/50 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="p-4">
          {hasOriginal ? (
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{original}</pre>
          ) : (
            <span className="text-sm italic text-muted-foreground">Not present in original</span>
          )}
        </div>
        <div className="p-4">
          {hasOptimized ? (
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {tokens.map((t, i) =>
                typeof t === 'string' ? (
                  <span key={i}>{t}</span>
                ) : (
                  <span key={i} className="rounded-sm bg-amber-200 px-0.5 text-amber-900 ring-1 ring-amber-400 dark:bg-amber-500/30 dark:text-amber-200 dark:ring-amber-400">
                    {t.text}
                  </span>
                )
              )}
            </pre>
          ) : (
            <span className="text-sm italic text-muted-foreground">Not present in optimized</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ComparisonView({
  originalContent,
  optimizedContent,
}: {
  originalContent: string
  optimizedContent: string
}) {
  const orig = useMemo(() => parseResume(originalContent), [originalContent])
  const opt = useMemo(() => parseResume(optimizedContent), [optimizedContent])

  const { added } = useMemo(
    () => computeDiffWords(originalContent, optimizedContent),
    [originalContent, optimizedContent]
  )
  const addedWords = useMemo(() => new Set(added.map((w) => w.toLowerCase())), [added])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs">
          Original
        </Badge>
        <Badge variant="secondary" className="text-xs bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200">
          Optimized
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resume Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {SECTIONS.map((section) => (
            <SectionRow
              key={section.key}
              label={section.label}
              original={findSection(orig.sections, section.key)}
              optimized={findSection(opt.sections, section.key)}
              addedWords={addedWords}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
