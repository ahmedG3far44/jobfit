import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { versionsApi } from '@/lib/api/versions'
import { resumesApi } from '@/lib/api/resumes'
import { aiApi } from '@/lib/api/ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { ComparisonView } from '@/components/resume/ComparisonView'
import { WritingStyleSelector } from '@/components/resume/WritingStyleSelector'
import { DetailSkeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ArrowLeft, FileSignature, Trash2, Pencil, Sparkles, Save, X, GitCompare } from 'lucide-react'
import type { Resume, ResumeVersion } from '@/types'
import type { WritingStyle } from '@/lib/writing-styles'

export function VersionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [version, setVersion] = useState<ResumeVersion | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [aiContent, setAiContent] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [generatingLetter, setGeneratingLetter] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showComparison, setShowComparison] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [letterStyle, setLetterStyle] = useState<WritingStyle>('professional')

  const [editingResume, setEditingResume] = useState(false)
  const [showRegenerateInput, setShowRegenerateInput] = useState(false)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [regenerating, setRegenerating] = useState(false)

  const [editingLetter, setEditingLetter] = useState(false)
  const [letterDraft, setLetterDraft] = useState('')

  useEffect(() => {
    if (!token || !id) return
    versionsApi.getById(id, token)
      .then(async (v) => {
        setVersion(v)
        setAiContent(v.aiContent)
        if (v.resumeId) {
          try {
            const r = await resumesApi.getById(v.resumeId, token)
            setResume(r)
          } catch { /* resume may have been deleted */ }
        }
      })
      .finally(() => setLoading(false))
  }, [id, token])

  const handleSaveEditedResume = async (editedContent: string) => {
    setAiContent(editedContent)
    setEditingResume(false)
    if (token && id) {
      try {
        await versionsApi.update(id, { aiContent: editedContent }, token)
        toast('Resume changes saved', 'success')
      } catch {
        toast('Failed to persist changes', 'error')
      }
    }
  }

  const handleRegenerateResume = async () => {
    if (!token || !id || !version || !resume) return
    setRegenerating(true)
    try {
      const result = await aiApi.fitResume({
        resumeId: version.resumeId,
        jobDescription: version.jobDescription,
        customInstructions: regeneratePrompt || undefined,
      }, token)
      setAiContent(result.aiContent)
      setShowRegenerateInput(false)
      setRegeneratePrompt('')
      toast('Resume regenerated', 'success')
    } catch {
      toast('Regeneration failed', 'error')
    } finally {
      setRegenerating(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!token || !version) return
    setGeneratingLetter(true)
    try {
      const result = await aiApi.generateCoverLetter({
        resumeContent: aiContent,
        jobDescription: version.jobDescription,
        company: version.company,
        jobTitle: version.jobTitle,
        style: letterStyle,
      }, token)
      const body = result.content.trim()
      const signature = `\n\nSincerely,\n${user?.name || 'Applicant'}`
      setCoverLetter(body + signature)
      toast('Cover letter generated', 'success')
    } catch {
      toast('Failed to generate cover letter', 'error')
    } finally {
      setGeneratingLetter(false)
    }
  }

  const handleSaveEditedLetter = () => {
    setCoverLetter(letterDraft)
    setEditingLetter(false)
    toast('Cover letter updated', 'success')
  }

  const handleDelete = async () => {
    if (!token || !id) return
    setDeleting(true)
    try {
      await versionsApi.delete(id, token)
      toast('Version deleted', 'success')
      navigate('/versions')
    } catch {
      toast('Failed to delete version', 'error')
      setDeleting(false)
      setShowDelete(false)
    }
  }

  const handleCopyLetter = async () => {
    if (!coverLetter) return
    try {
      await navigator.clipboard.writeText(coverLetter)
      toast('Cover letter copied', 'success')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = coverLetter
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      toast('Cover letter copied', 'success')
    }
  }

  if (loading) return <DetailSkeleton />

  if (!version) {
    return <div className="text-center py-12 text-muted-foreground">Version not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/versions')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{version.name}</h1>
            <p className="text-muted-foreground truncate">
              {version.company} &middot; {resume?.title || version.jobTitle}
            </p>
          </div>
        </div>
        <Button variant="destructive" size="icon" onClick={() => setShowDelete(true)} className="shrink-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              {version.jobDescription}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Original Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              {resume?.parsedContent ?? 'Resume data not available'}
            </pre>
          </CardContent>
        </Card>
      </div>

      {editingResume ? (
        <ResumeEditor
          content={aiContent}
          onSave={handleSaveEditedResume}
          onCancel={() => setEditingResume(false)}
        />
      ) : (
        <>
          <ResumePreview
            content={aiContent}
            filename={version.name}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setEditingResume(true)}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRegenerateInput(!showRegenerateInput)}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              Regenerate with Custom Prompt
            </Button>
          </div>
          {showRegenerateInput && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Custom Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={regeneratePrompt}
                  onChange={(e) => setRegeneratePrompt(e.target.value)}
                  placeholder="e.g. Emphasize my leadership experience, use more action verbs..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleRegenerateResume} disabled={regenerating}>
                    {regenerating ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setShowRegenerateInput(false); setRegeneratePrompt('') }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cover Letter Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WritingStyleSelector value={letterStyle} onChange={setLetterStyle} disabled={generatingLetter} />
          <div className="flex gap-3">
            {!coverLetter ? (
              <Button onClick={handleGenerateCoverLetter} disabled={generatingLetter}>
                <FileSignature className="mr-2 h-4 w-4" />
                {generatingLetter ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleGenerateCoverLetter} disabled={generatingLetter}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  {generatingLetter ? 'Generating...' : 'Regenerate'}
                </Button>
                <Button variant="outline" onClick={handleCopyLetter}>
                  Copy Letter
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {coverLetter && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cover Letter</CardTitle>
            <div className="flex gap-1 shrink-0">
              {editingLetter ? (
                <>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => { setEditingLetter(false); setLetterDraft(coverLetter) }}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSaveEditedLetter}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setLetterDraft(coverLetter); setEditingLetter(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setCoverLetter('')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingLetter ? (
              <Textarea
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                className="min-h-[200px] font-sans text-sm"
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{coverLetter}</pre>
            )}
          </CardContent>
        </Card>
      )}

      {resume && (
        <>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="group fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          >
            <GitCompare className="h-5 w-5" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow transition-opacity group-hover:opacity-100">
              Resume Comparison
            </span>
          </button>

          {showComparison && (
            <>
              <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowComparison(false)} />
              <div className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Resume Comparison</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowComparison(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ComparisonView
                  originalContent={resume.parsedContent}
                  optimizedContent={aiContent}
                  jobDescription={version.jobDescription}
                />
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={showDelete}
        title="Delete Version"
        message={`Are you sure you want to delete "${version.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
