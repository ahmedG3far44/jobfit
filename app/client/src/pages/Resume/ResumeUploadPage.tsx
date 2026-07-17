import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { resumesApi } from '@/lib/api/resumes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react'

export function ResumeUploadPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [parsedContent, setParsedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPaste, setShowPaste] = useState(false)
  const [titleError, setTitleError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTitleError('')

    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    if (!file && !parsedContent.trim()) {
      setError('Upload a file or paste your resume content')
      return
    }
    if (!token) return

    setLoading(true)
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title.trim())
        formData.append('parsedContent', parsedContent)
        const resume = await resumesApi.upload(formData, token)
        toast('Resume uploaded — content extracted from file', 'success')
        navigate(`/resumes/${resume._id}`)
      } else {
        const resume = await resumesApi.create({ title: title.trim(), parsedContent }, token)
        toast('Resume created', 'success')
        navigate(`/resumes/${resume._id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Upload Resume</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resume Details</CardTitle>
          <CardDescription>Upload your resume file and we'll extract the content automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError('') }}
                placeholder="e.g. Frontend Developer Resume"
                required
              />
              {titleError && <p className="text-xs text-destructive">{titleError}</p>}
            </div>

            <div className="space-y-2">
              <Label>Upload File (PDF, DOCX)</Label>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 hover:bg-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {file ? file.name : 'Click to upload your resume'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF or DOCX — content will be extracted automatically
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-card px-2 text-xs text-muted-foreground"
                  onClick={() => setShowPaste(!showPaste)}
                >
                  {showPaste ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                  {showPaste ? 'Hide manual input' : 'Or paste content manually'}
                </Button>
              </div>
            </div>

            {showPaste && (
              <div className="space-y-2">
                <Label htmlFor="content">Resume Content</Label>
                <Textarea
                  id="content"
                  value={parsedContent}
                  onChange={(e) => setParsedContent(e.target.value)}
                  placeholder="Paste your resume content here... (only needed if you don't upload a file)"
                  className="min-h-[200px]"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
