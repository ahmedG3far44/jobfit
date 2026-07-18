import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { resumesApi } from '@/lib/api/resumes'
import { versionsApi } from '@/lib/api/versions'
import { aiApi } from '@/lib/api/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ComparisonView } from '@/components/resume/ComparisonView'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { DetailSkeleton } from '@/components/ui/skeleton'
import { Sparkles, Check, Pencil, X } from 'lucide-react'
import type { Resume } from '@/types'

type Step = 'form' | 'preview' | 'edit'

export function CreateVersionPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [resume, setResume] = useState<Resume | null>(null)
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [aiContent, setAiContent] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [a4Optimized, setA4Optimized] = useState(false)
  const [companyError, setCompanyError] = useState('')
  const [jobTitleError, setJobTitleError] = useState('')
  const [jdError, setJdError] = useState('')

  useEffect(() => {
    if (!token || !id) return
    resumesApi.getById(id, token)
      .then(setResume)
      .finally(() => setLoading(false))
  }, [id, token])

  const validate = () => {
    let valid = true
    setCompanyError('')
    setJobTitleError('')
    setJdError('')

    if (!company.trim()) { setCompanyError('Company is required'); valid = false }
    if (!jobTitle.trim()) { setJobTitleError('Job title is required'); valid = false }
    if (!jobDescription.trim()) { setJdError('Job description is required'); valid = false }

    return valid
  }

  const handleGenerate = async () => {
    if (!validate()) return
    if (!token || !id) return
    setGenerating(true)
    setError('')
    try {
      const result = await aiApi.fitResume({ resumeId: id, jobDescription, a4Optimized }, token)
      setAiContent(result.aiContent)
      setStep('preview')
      toast('Resume optimized successfully', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed')
      toast('AI generation failed', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleAccept = async (content: string) => {
    if (!token || !id) return
    setSaving(true)
    setError('')
    try {
      const version = await versionsApi.create({
        resumeId: id,
        name: `${company.trim()} - ${jobTitle.trim()}`,
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription,
        aiContent: content,
      }, token)
      toast('Version saved', 'success')
      navigate(`/versions/${version._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      toast('Failed to save version', 'error')
      setSaving(false)
    }
  }

  const handleEditSave = (editedContent: string) => {
    setAiContent(editedContent)
    setStep('preview')
    toast('Changes applied', 'success')
  }

  const handleDiscard = () => {
    setAiContent('')
    setStep('form')
  }

  if (loading) return <DetailSkeleton />

  if (!resume) {
    return <div className="text-center py-12 text-muted-foreground">Resume not found</div>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">Create Resume Version</h1>

      {step === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Paste the job description and let AI tailor your resume.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-3 text-sm">
              <span className="font-medium">Master Resume:</span> {resume.title}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => { setCompany(e.target.value); setCompanyError('') }} placeholder="e.g. Google" required readOnly={generating} className={generating ? 'opacity-60 cursor-not-allowed' : ''} />
                {companyError && <p className="text-xs text-destructive">{companyError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setJobTitleError('') }} placeholder="e.g. Frontend Developer" required readOnly={generating} className={generating ? 'opacity-60 cursor-not-allowed' : ''} />
                {jobTitleError && <p className="text-xs text-destructive">{jobTitleError}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => { setJobDescription(e.target.value.trim()); setJdError('') }}
                placeholder="Paste the job description here..."
                className={`min-h-[200px] ${generating ? 'opacity-60 cursor-not-allowed' : ''}`}
                required
                readOnly={generating}
              />
              {jdError && <p className="text-xs text-destructive">{jdError}</p>}
            </div>

            <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent transition-colors">
              <input
                type="checkbox"
                checked={a4Optimized}
                onChange={(e) => setA4Optimized(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-medium leading-none">A4 Optimized (Single Page)</span>
                <p className="text-xs text-muted-foreground">
                  Produces ultra-concise bullet points that fit exactly one A4 page. Prioritizes the most relevant content and removes fluff.
                </p>
              </div>
            </label>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? 'AI is optimizing your resume...' : 'Fit Resume'}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && aiContent && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{company.trim()} — {jobTitle.trim()}</h2>
              <p className="text-sm text-muted-foreground">Review the optimized version below</p>
            </div>
          </div>

          <ComparisonView
            originalContent={resume.parsedContent}
            optimizedContent={aiContent}
            jobDescription={jobDescription}
          />

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={handleDiscard} disabled={saving}>
              <X className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button variant="secondary" onClick={() => setStep('edit')} disabled={saving}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button onClick={() => handleAccept(aiContent)} disabled={saving}>
              <Check className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Accept & Save'}
            </Button>
          </div>
        </>
      )}

      {step === 'edit' && (
        <ResumeEditor
          content={aiContent}
          onSave={handleEditSave}
          onCancel={() => setStep('preview')}
        />
      )}
    </div>
  )
}
