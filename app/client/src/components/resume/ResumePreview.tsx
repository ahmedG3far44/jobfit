import { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check, Download, File as FileIcon, FileText, ChevronDown } from 'lucide-react'
import { parseResume } from '@/lib/resume-parser'
import { ExportPdfModal } from './ExportPdfModal'

function ResumeContent({ content }: { content: string }) {
  const parsed = parseResume(content)
  const sections = parsed.sections.filter((s) => s.name !== 'Contact')

  if (sections.length > 0) {
    return (
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.name}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-1">
              {section.name}
            </h3>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {section.content}
            </pre>
          </div>
        ))}
      </div>
    )
  }

  return (
    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</pre>
  )
}

const CONTACT_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  portfolio: 'Portfolio',
  behance: 'Behance',
  other: 'Link',
}

function ContactInfo({ user }: { user: { name: string; phone: string; contacts: { type: string; value: string }[]; globalLocation: string; localLocation: string } | null }) {
  if (!user) return null
  const { name, phone, contacts, globalLocation, localLocation } = user
  const hasLinks = contacts.some((c) => c.value)
  const hasLocation = globalLocation || localLocation

  if (!phone && !hasLinks && !hasLocation) return null

  const infoParts: string[] = []
  if (localLocation) infoParts.push(localLocation)
  if (globalLocation) infoParts.push(globalLocation)

  return (
    <div className="border-b pb-4 mb-4">
      <h2 className="text-lg font-bold">{name}</h2>
      {(phone || infoParts.length > 0) && (
        <div className="mt-1 text-sm text-muted-foreground">
          {phone}{phone && infoParts.length > 0 ? ' · ' : ''}{infoParts.join(' · ')}
        </div>
      )}
      {hasLinks && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {contacts.filter((c) => c.value).map((c, i) => (
            <a
              key={i}
              href={c.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {CONTACT_LABELS[c.type] || c.type}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function ResumePreview({ content, filename }: {
  content: string
  filename?: string
}) {
  const { user, token } = useAuth()
  const [copied, setCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExportDocx = async () => {
    setDropdownOpen(false)
    if (!token) return
    setExporting(true)
    try {
      await api.download('/export/docx', { content, filename: filename || 'Optimized Resume' }, token, `${filename || 'optimized-resume'}.docx`)
    } catch {
      // silent
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Optimized Resume</CardTitle>
          <div className="flex gap-2">
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-1 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card shadow-lg">
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-t-md"
                      onClick={() => { setDropdownOpen(false); setShowPdfModal(true) }}
                    >
                      <FileIcon className="h-4 w-4" />
                      Export as PDF
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-b-md"
                      onClick={handleExportDocx}
                      disabled={exporting}
                    >
                      <FileText className="h-4 w-4" />
                      Export as DOCX
                    </button>
                  </div>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" />
                  Copy Text
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ContactInfo user={user} />
            <ResumeContent content={content} />

            <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3 text-green-500" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy to clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showPdfModal && (
        <ExportPdfModal
          content={content}
          filename={filename}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </>
  )
}
