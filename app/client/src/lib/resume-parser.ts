const SECTION_HEADERS = ['Contact', 'Summary', 'Skills', 'Experience', 'Projects', 'Education'] as const
export type ResumeSection = typeof SECTION_HEADERS[number]

export interface ParsedResume {
  sections: { name: ResumeSection; content: string }[]
  raw: string
}

const HEADER_PATTERN = new RegExp(
  `^(?:#\\s*)?(${SECTION_HEADERS.join('|')})\\s*:?\\s*$`,
  'm'
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
