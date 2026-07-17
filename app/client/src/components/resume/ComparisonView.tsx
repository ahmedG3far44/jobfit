import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { parseResume, findSection, computeDiffWords, computeKeywordMatchScore, type ResumeSection } from '@/lib/resume-parser'

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

const SIZE = 72
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getScoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#65a30d'
  if (score >= 40) return '#d97706'
  if (score >= 20) return '#dc2626'
  return '#b91c1c'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Moderate'
  if (score >= 20) return 'Weak'
  return 'Poor'
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score)
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={SIZE} height={SIZE} className="drop-shadow-sm">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className="transition-all duration-500"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize="18"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {score}%
        </text>
      </svg>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  )
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
  jobDescription,
}: {
  originalContent: string
  optimizedContent: string
  jobDescription?: string
}) {
  const orig = useMemo(() => parseResume(originalContent), [originalContent])
  const opt = useMemo(() => parseResume(optimizedContent), [optimizedContent])

  const { added } = useMemo(
    () => computeDiffWords(originalContent, optimizedContent),
    [originalContent, optimizedContent]
  )
  const addedWords = useMemo(() => new Set(added.map((w) => w.toLowerCase())), [added])

  const origScore = useMemo(
    () => (jobDescription ? computeKeywordMatchScore(originalContent, jobDescription) : 0),
    [originalContent, jobDescription]
  )
  const optScore = useMemo(
    () => (jobDescription ? computeKeywordMatchScore(optimizedContent, jobDescription) : 0),
    [optimizedContent, jobDescription]
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resume Comparison</CardTitle>
          {jobDescription && (
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-1 border-r">
                <Badge variant="outline" className="mb-1 text-xs">Before Optimization</Badge>
                <ScoreCircle score={origScore} label={getScoreLabel(origScore)} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Badge variant="secondary" className="mb-1 text-xs bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200">After Optimization</Badge>
                <ScoreCircle score={optScore} label={getScoreLabel(optScore)} />
              </div>
            </div>
          )}
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
