import { useState, useRef, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check, Download, File as FileIcon, FileText, ChevronDown, Eye } from 'lucide-react'
import { parseResume, toLatex } from '@/lib/resume-parser'
import { ExportPdfModal } from './ExportPdfModal'
import type { User } from '@/types'

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

function Sep({ show }: { show: boolean }) {
  if (!show) return null
  return <span>  ·  </span>
}

function ContactInfo({ user }: { user: { name: string; email: string; phone: string; contacts: { type: string; value: string }[]; globalLocation: string; localLocation: string } | null }) {
  if (!user) return null
  const { name, phone, email, contacts, globalLocation, localLocation } = user

  const locationParts: string[] = []
  if (localLocation) locationParts.push(localLocation)
  if (globalLocation) locationParts.push(globalLocation)

  const links = contacts.filter((c) => c.value)

  if (!name) return null

  const hasLocation = locationParts.length > 0
  const hasPhone = !!phone
  const hasEmail = !!email
  const hasLinks = links.length > 0

  return (
    <div className="border-b pb-4 mb-4">
      <h2 className="text-lg font-bold">{name}</h2>
      <div className="mt-1 text-sm text-muted-foreground">
        {hasLocation && <span>{locationParts.join(', ')}</span>}
        <Sep show={hasLocation && (hasPhone || hasEmail || hasLinks)} />
        {hasPhone && <span>{phone}</span>}
        <Sep show={hasPhone && (hasEmail || hasLinks)} />
        {hasEmail && <span>{email}</span>}
        <Sep show={hasEmail && hasLinks} />
        {links.map((c, i) => (
          <span key={i}>
            {i > 0 ? '  ·  ' : ''}
            <a href={c.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{CONTACT_LABELS[c.type] || c.type}</a>
          </span>
        ))}
      </div>
    </div>
  )
}

function A4PdfPreview({ content, user }: { content: string; user: Pick<User, 'name' | 'phone' | 'email' | 'contacts' | 'globalLocation' | 'localLocation'> | null }) {
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
    <div className="mx-auto bg-white shadow-lg border" style={{ aspectRatio: '1 / 1.414', maxHeight: '75vh' }}>
      <div className="h-full w-full overflow-y-auto p-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', lineHeight: '1.5' }}>
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
        {sections.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No content to preview</p>
        ) : (
          sections.map((s) => (
            <div key={s.name} className="mb-3 last:mb-0">
              <div className="font-bold uppercase tracking-wider text-xs border-b border-gray-300 pb-0.5 mb-1.5 text-gray-800">{s.name}</div>
              <div className="text-xs leading-relaxed">
                {s.content.split('\n').map((line, i) => (
                  <div key={i}>{line || '\u00A0'}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function ResumePreview({ content, filename }: {
  content: string
  filename?: string
}) {
  const { user, token } = useAuth()
  const [copied, setCopied] = useState<'text' | 'latex' | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showA4Preview, setShowA4Preview] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const copyDropdownRef = useRef<HTMLDivElement>(null)

  const doCopy = async (type: 'text' | 'latex') => {
    const text = type === 'latex' ? toLatex(content, user ?? undefined) : content
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setCopyDropdownOpen(false)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(type)
      setCopyDropdownOpen(false)
      setTimeout(() => setCopied(null), 2000)
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
          <CardTitle className="text-base">Optimized Resume</CardTitle>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={exporting}
                className="w-full sm:w-auto"
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
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card shadow-lg sm:right-0 sm:left-auto">
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent rounded-t-md"
                      onClick={() => { setDropdownOpen(false); setShowPdfModal(true) }}
                    >
                      <FileIcon className="h-4 w-4" />
                      Export as PDF
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent rounded-b-md"
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
            <Button
              variant={showA4Preview ? "default" : "outline"}
              size="sm"
              onClick={() => setShowA4Preview(!showA4Preview)}
              className="w-full sm:w-auto"
            >
              <Eye className="mr-1 h-4 w-4" />
              {showA4Preview ? 'Normal View' : 'Preview PDF'}
            </Button>
            <div className="relative" ref={copyDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCopyDropdownOpen(!copyDropdownOpen)}
                className="w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4 text-green-500" />
                    {copied === 'latex' ? 'Latex Copied' : 'Copied'}
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
              {copyDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCopyDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-md border bg-card shadow-lg sm:right-0 sm:left-auto">
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent rounded-t-md"
                      onClick={() => doCopy('text')}
                    >
                      <Copy className="h-4 w-4" />
                      Copy as Text
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent rounded-b-md"
                      onClick={() => doCopy('latex')}
                    >
                      <FileText className="h-4 w-4" />
                      Copy as LaTeX
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showA4Preview ? (
            <A4PdfPreview content={content} user={user} />
          ) : (
            <div className="space-y-4">
              <ContactInfo user={user} />
              <ResumeContent content={content} />

              <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => doCopy('text')}>
                    {copied === 'text' ? (
                      <>
                        <Check className="mr-1 h-3 w-3 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy text
                      </>
                    )}
                  </Button>
                  <span className="text-muted-foreground/40">|</span>
                  <Button variant="ghost" size="sm" onClick={() => doCopy('latex')}>
                    {copied === 'latex' ? (
                      <>
                        <Check className="mr-1 h-3 w-3 text-green-500" />
                        Latex Copied
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1 h-3 w-3" />
                        Copy LaTeX
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {showPdfModal && (
        <ExportPdfModal
          content={content}
          filename={filename}
          user={user}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </>
  )
}
