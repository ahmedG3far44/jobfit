const SECTION_HEADERS = ['Contact', 'Summary', 'Skills', 'Experience', 'Projects', 'Education'] as const
export type ResumeSection = typeof SECTION_HEADERS[number]

export interface ParsedResume {
  sections: { name: ResumeSection; content: string }[]
  raw: string
}

const HEADER_PATTERN = new RegExp(
  `^(?:#+\\s*)?(${SECTION_HEADERS.join('|')})\\s*:?\\s*$`,
  'mi'
)

function splitByHeaders(text: string): { name: ResumeSection; content: string }[] {
  const lines = text.split('\n')
  const sections: { name: ResumeSection; content: string }[] = []
  let current: { name: ResumeSection; content: string[] } | null = null

  for (const line of lines) {
    const match = line.match(HEADER_PATTERN)
    if (match) {
      if (current) {
        sections.push({ name: current.name, content: current.content.join('\n').trim() })
      }
      current = { name: match[1] as ResumeSection, content: [] }
    } else if (current) {
      current.content.push(line)
    }
  }

  if (current) {
    sections.push({ name: current.name, content: current.content.join('\n').trim() })
  }

  return sections
}

export function parseResume(text: string): ParsedResume {
  const sections = splitByHeaders(text)
  return { sections: sections.filter((s) => s.content.length > 0), raw: text }
}

export function findSection(
  sections: { name: ResumeSection; content: string }[],
  name: ResumeSection
): string {
  return sections.find((s) => s.name === name)?.content ?? ''
}

export function sectionsToText(sections: { name: string; content: string }[]): string {
  return sections.map((s) => `${s.name}\n${s.content}`).join('\n\n')
}

export function computeDiffWords(original: string, optimized: string): { added: string[]; removed: string[] } {
  const origWords = original.split(/\s+/)
  const optWords = optimized.split(/\s+/)
  const origSet = new Set(origWords.map((w) => w.toLowerCase()))
  const optSet = new Set(optWords.map((w) => w.toLowerCase()))

  return {
    added: optWords.filter((w) => !origSet.has(w.toLowerCase()) && w.length > 2),
    removed: origWords.filter((w) => !optSet.has(w.toLowerCase()) && w.length > 2),
  }
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'shall', 'should', 'may',
  'might', 'must', 'it', 'its', 'this', 'that', 'these', 'those', 'we', 'our', 'you',
  'your', 'they', 'their', 'not', 'no', 'nor', 'so', 'if', 'than', 'then', 'each', 'all',
  'both', 'every', 'own', 'same', 'very', 'too', 'just', 'about', 'up', 'out', 'also',
  'more', 'most', 'some', 'any', 'such', 'into', 'over', 'after', 'before', 'between',
  'under', 'above', 'below', 'how', 'what', 'why', 'when', 'where', 'who', 'whom',
])

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/[^a-zA-Z0-9+#.-]+/)
  return [...new Set(words.filter((w) => w.length > 3 && !STOP_WORDS.has(w)))]
}

export function computeKeywordMatchScore(content: string, jobDescription: string): number {
  if (!jobDescription || !content) return 0
  const keywords = extractKeywords(jobDescription)
  if (keywords.length === 0) return 0
  const contentLower = content.toLowerCase()
  const matched = keywords.filter((kw) => contentLower.includes(kw))
  return Math.round((matched.length / keywords.length) * 100)
}

function escapeLatex(text: string): string {
  return text
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\^{}')
    .replace(/_/g, '\\_')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/%/g, '\\%')
    .replace(/[{}]/g, (m) => m === '{' ? '\\{' : '\\}')
    .replace(/\\/g, '\\textbackslash{}')
}

export function toLatex(
  content: string,
  user?: { name?: string; phone?: string; email?: string; contacts?: { type: string; value: string }[]; globalLocation?: string; localLocation?: string }
): string {
  const parsed = parseResume(content)
  const sections = parsed.sections.filter((s) => s.content.trim() && s.name !== 'Contact')

  const contactLabelMap: Record<string, string> = { linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portfolio', behance: 'Behance', other: 'Link' }

  const lines: string[] = []
  lines.push('\\documentclass[11pt]{article}')
  lines.push('\\usepackage[letterpaper,margin=0.75in]{geometry}')
  lines.push('\\usepackage{enumitem}')
  lines.push('\\usepackage{hyperref}')
  lines.push('\\pagestyle{empty}')
  lines.push('\\setlength{\\parindent}{0pt}')
  lines.push('\\setlength{\\parskip}{4pt}')
  lines.push('')
  lines.push('\\begin{document}')
  lines.push('')

  if (user?.name) {
    const locationParts: string[] = []
    if (user.localLocation) locationParts.push(user.localLocation)
    if (user.globalLocation) locationParts.push(user.globalLocation)

    const linkLabels = (user.contacts ?? []).filter((c) => c.value).map((c) => contactLabelMap[c.type] || c.type)

    const contactParts: string[] = []
    if (locationParts.length > 0) contactParts.push(locationParts.join(', '))
    if (user.phone) contactParts.push(user.phone)
    if (user.email) contactParts.push(user.email)
    contactParts.push(...linkLabels)

    lines.push(`\\begin{center}`)
    lines.push(`{\\huge \\textbf{${escapeLatex(user.name)}}}`)
    if (contactParts.length > 0) {
      lines.push(`\\\\[4pt]`)
      lines.push(`{\\small ${contactParts.join(' $|$ ')}}`)
    }
    lines.push(`\\end{center}`)
    lines.push('')
    lines.push('\\vspace{4pt}')
    lines.push('\\hrule')
    lines.push('\\vspace{6pt}')
    lines.push('')
  }

  for (const section of sections) {
    lines.push(`\\section*{${escapeLatex(section.name)}}`)
    const paragraphLines = section.content.split('\n').filter((l) => l.trim())
    const regularLines = paragraphLines.filter((p) => !p.startsWith('- ') && !p.startsWith('• '))
    const bulletLines = paragraphLines.filter((p) => p.startsWith('- ') || p.startsWith('• ')).map((p) => p.replace(/^[-•]\s*/, ''))

    for (const line of regularLines) {
      lines.push(escapeLatex(line))
    }
    if (bulletLines.length > 0) {
      lines.push('\\begin{itemize}[leftmargin=*,nosep]')
      for (const bl of bulletLines) {
        lines.push(`  \\item ${escapeLatex(bl)}`)
      }
      lines.push('\\end{itemize}')
    }
    lines.push('')
  }

  lines.push('\\end{document}')
  return lines.join('\n')
}
