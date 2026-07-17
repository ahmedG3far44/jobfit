import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { versionsApi } from '@/lib/api/versions'
import { aiApi } from '@/lib/api/ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { TableSkeleton } from '@/components/ui/skeleton'
import { WritingStyleSelector } from '@/components/resume/WritingStyleSelector'
import { FileSignature, Trash2, RefreshCw, Copy, Check, Pencil, Save, X } from 'lucide-react'
import type { ResumeVersion } from '@/types'
import type { WritingStyle } from '@/lib/writing-styles'

export function CoverLettersPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({})
  const [styles, setStyles] = useState<Record<string, WritingStyle>>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!token) return
    versionsApi.getAll(token)
      .then(setVersions)
      .finally(() => setLoading(false))
  }, [token])

  const handleGenerate = async (version: ResumeVersion) => {
    if (!token) return
    const key = version._id
    const style = styles[key] || 'professional'
    setGenerating((prev) => ({ ...prev, [key]: true }))
    try {
      const result = await aiApi.generateCoverLetter({
        resumeContent: version.aiContent,
        jobDescription: version.jobDescription,
        company: version.company,
        jobTitle: version.jobTitle,
        style,
      }, token)
      setCoverLetters((prev) => ({ ...prev, [key]: result.content }))
      setExpandedId(key)
    } catch {
      // silent
    } finally {
      setGenerating((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const handleDeleteLetter = (id: string) => {
    setCoverLetters((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleEditStart = (id: string) => {
    setEditDrafts((prev) => ({ ...prev, [id]: coverLetters[id] }))
    setEditingId(id)
  }

  const handleEditSave = (id: string) => {
    const draft = editDrafts[id]
    if (draft !== undefined) {
      setCoverLetters((prev) => ({ ...prev, [id]: draft }))
    }
    setEditingId(null)
  }

  const handleEditCancel = (id: string) => {
    setEditDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Cover Letters</h1>
        <TableSkeleton rows={4} />
      </div>
    )
  }

  const versionsWithLetters = versions.filter((v) => coverLetters[v._id] || generating[v._id])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cover Letters</h1>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileSignature className="mx-auto h-8 w-8 mb-3" />
            <p>No cover letters yet</p>
            <p className="text-sm mt-1">Create a resume version first, then generate a cover letter from it.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {versionsWithLetters.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No cover letters generated yet</p>
                <p className="text-sm mt-1">Select a style below and generate a cover letter for any version.</p>
              </CardContent>
            </Card>
          )}

          {versionsWithLetters.map((version) => {
            const key = version._id
            const letter = coverLetters[key]
            const isCopied = copiedId === key
            const isExpanded = expandedId === key
            const currentStyle = styles[key] || 'professional'
            const isEditing = editingId === key

            return (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{version.company}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {version.jobTitle} &middot; {version.name}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {letter && !isEditing && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditStart(key)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(key, letter)}>
                            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteLetter(key)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleGenerate(version)}
                        disabled={generating[key]}
                      >
                        <RefreshCw className={`h-4 w-4 ${generating[key] ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!letter && !generating[key] && !isEditing && (
                    <WritingStyleSelector
                      value={currentStyle}
                      onChange={(s) => setStyles((prev) => ({ ...prev, [key]: s }))}
                    />
                  )}

                  {generating[key] ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Generating...
                    </div>
                  ) : isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editDrafts[key] || ''}
                        onChange={(e) => setEditDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="min-h-[200px] font-sans text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditSave(key)}>
                          <Save className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditCancel(key)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : letter ? (
                    <div>
                      <pre className={`whitespace-pre-wrap text-sm font-sans leading-relaxed ${isExpanded ? '' : 'line-clamp-6'}`}>
                        {letter}
                      </pre>
                      {letter.length > 300 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-2 h-auto p-0"
                          onClick={() => setExpandedId(isExpanded ? null : key)}
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerate(version)}
                    >
                      Generate Cover Letter
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {versions.length > versionsWithLetters.length && (
            <div className="text-center py-6">
              <Button variant="outline" onClick={() => navigate('/versions')}>
                Browse Versions
              </Button>
            </div>
          )}

          {versions.map((v) => {
            const key = v._id
            if (coverLetters[key] || generating[key]) return null
            return (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{v.company}</CardTitle>
                      <p className="text-sm text-muted-foreground">{v.jobTitle} &middot; {v.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <WritingStyleSelector
                    value={styles[key] || 'professional'}
                    onChange={(s) => setStyles((prev) => ({ ...prev, [key]: s }))}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleGenerate(v)}>
                    Generate Cover Letter
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
