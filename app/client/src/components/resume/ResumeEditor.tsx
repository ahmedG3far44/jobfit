import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { parseResume, sectionsToText, type ResumeSection } from '@/lib/resume-parser'
import { Pencil, Save, X } from 'lucide-react'

const CONTACT_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  portfolio: 'Portfolio',
  behance: 'Behance',
  other: 'Link',
}

function formatContactContent(user: { name: string; phone: string; contacts: { type: string; value: string }[]; globalLocation: string; localLocation: string } | null): string {
  if (!user) return ''
  const parts: string[] = [user.name]
  if (user.phone) parts.push(user.phone)
  for (const c of user.contacts) {
    if (c.value) parts.push(`${CONTACT_LABELS[c.type]}: ${c.value}`)
  }
  if (user.localLocation) parts.push(user.localLocation)
  if (user.globalLocation) parts.push(`Remote-ready: ${user.globalLocation}`)
  return parts.join('\n')
}

const SECTIONS: { key: string; label: string; placeholder: string; isContact?: boolean }[] = [
  { key: 'Contact', label: 'Contact', placeholder: 'Phone\nLinkedIn: https://...\nGitHub: https://...\nLocation', isContact: true },
  { key: 'Summary', label: 'Summary', placeholder: 'Professional summary...' },
  { key: 'Skills', label: 'Skills', placeholder: 'JavaScript, TypeScript, React...' },
  { key: 'Experience', label: 'Experience', placeholder: 'Company - Role\n- Achievement 1\n- Achievement 2' },
  { key: 'Projects', label: 'Projects', placeholder: 'Project Name\n- Description' },
  { key: 'Education', label: 'Education', placeholder: 'Degree, Institution, Year' },
]

interface SectionEditorProps {
  name: string
  content: string
  placeholder: string
  onChange: (content: string) => void
}

function SectionEditor({ name, content, placeholder, onChange }: SectionEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(content)
  const [initial] = useState(content)

  useEffect(() => {
    if (!editing) {
      setValue(content)
    }
  }, [content, editing])

  const handleSave = () => {
    onChange(value)
    setEditing(false)
  }

  const handleCancel = () => {
    setValue(initial)
    setEditing(false)
  }

  const hasChanges = value !== content

  return (
    <div className="border-b last:border-b-0">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{name}</span>
        {!editing ? (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(true)}>
            <Pencil className="h-3 w-3" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] font-sans text-sm"
            autoFocus
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
            {content || <span className="italic text-muted-foreground">Empty</span>}
          </pre>
        )}
      </div>
    </div>
  )
}

export function ResumeEditor({
  content,
  onSave,
  onCancel,
}: {
  content: string
  onSave: (editedContent: string) => void
  onCancel: () => void
}) {
  const { user } = useAuth()
  const parsed = parseResume(content)

  const initialContactContent = formatContactContent(user)

  const [sections, setSections] = useState(() => {
    const hasContact = parsed.sections.length > 0 && parsed.sections[0].name === 'Contact'
    if (hasContact) return parsed.sections
    return [{ name: 'Contact' as const, content: initialContactContent }, ...parsed.sections]
  })

  useEffect(() => {
    const parsed = parseResume(content)
    const hasContact = parsed.sections.length > 0 && parsed.sections[0].name === 'Contact'
    setSections(
      hasContact
        ? parsed.sections
        : [{ name: 'Contact' as const, content: initialContactContent }, ...parsed.sections]
    )
  }, [content, initialContactContent])

  const handleSectionChange = (name: string, newContent: string) => {
    setSections((prev) =>
      prev.map((s) => (s.name === name ? { ...s, content: newContent } : s))
    )
  }

  const result = sectionsToText(sections)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Edit Resume</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(result)}>
            <Save className="mr-1 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {SECTIONS.map((section) => {
          const existing = sections.find((s) => s.name === section.key)
          return (
            <SectionEditor
              key={section.key}
              name={section.label}
              content={existing?.content ?? ''}
              placeholder={section.placeholder}
              onChange={(val) => handleSectionChange(section.key, val)}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
