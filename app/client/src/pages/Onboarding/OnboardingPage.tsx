import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { resumesApi } from '@/lib/api/resumes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Check, ArrowRight, FileText } from 'lucide-react'

const STEPS = ['Welcome', 'Upload Resume', 'Done']

export function OnboardingPage() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [parsedContent, setParsedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPaste, setShowPaste] = useState(false)
  const [checkingResumes, setCheckingResumes] = useState(true)

  useEffect(() => {
    if (!token) return
    resumesApi.getAll(token)
      .then((resumes) => {
        if (resumes.length > 0) {
          navigate('/dashboard', { replace: true })
        }
      })
      .finally(() => setCheckingResumes(false))
  }, [token, navigate])

  if (checkingResumes) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (!title.trim()) { setError('Please enter a title'); return }
    if (!file && !parsedContent.trim()) { setError('Upload a file or paste your resume'); return }

    setError('')
    setLoading(true)
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title.trim())
        formData.append('parsedContent', parsedContent)
        await resumesApi.upload(formData, token)
      } else {
        await resumesApi.create({ title: title.trim(), parsedContent }, token)
      }
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`mx-3 h-px w-12 ${i < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 0 && (
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to ResumeFit AI{user ? `, ${user.name}` : ''}!</CardTitle>
            <CardDescription className="text-base mt-2">
              Let's get started by uploading your first resume. Just upload your PDF or DOCX file — we'll extract the content automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium mb-1">Here's what you can do:</p>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Upload one or more master resumes</li>
                  <li>Paste a job description and let AI optimize your resume</li>
                  <li>Compare original vs optimized versions side-by-side</li>
                  <li>Generate matching cover letters</li>
                  <li>Export as PDF or text</li>
                </ul>
              </div>
              <Button className="w-full" size="lg" onClick={() => setStep(1)}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>Upload your PDF or DOCX file and we'll extract the content for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer Resume"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Upload File (PDF, DOCX)</Label>
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-accent transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {file ? file.name : 'Click to upload your file'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Content will be extracted automatically
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => setShowPaste(!showPaste)}
                >
                  {showPaste ? 'Hide manual paste' : 'Or paste content manually'}
                </Button>
              </div>

              {showPaste && (
                <div className="space-y-2">
                  <Label htmlFor="content">Resume Content</Label>
                  <Textarea
                    id="content"
                    value={parsedContent}
                    onChange={(e) => setParsedContent(e.target.value)}
                    placeholder="Paste your resume content here..."
                    className="min-h-[150px]"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || (!file && !parsedContent)}>
                  {loading ? 'Uploading...' : 'Upload & Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">You're All Set!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your resume has been uploaded. You can now start creating AI-tailored versions for your job applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
