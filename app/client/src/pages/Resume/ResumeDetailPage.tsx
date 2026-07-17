import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { resumesApi } from '@/lib/api/resumes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailSkeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ArrowLeft, Trash2 } from 'lucide-react'
import type { Resume } from '@/types'

export function ResumeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { toast } = useToast()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    resumesApi.getById(id, token)
      .then(setResume)
      .finally(() => setLoading(false))
  }, [id, token])

  const handleDelete = async () => {
    if (!token || !id) return
    setDeleting(true)
    try {
      await resumesApi.delete(id, token)
      toast('Resume deleted', 'success')
      navigate('/resumes')
    } catch {
      toast('Failed to delete resume', 'error')
      setDeleting(false)
      setShowDelete(false)
    }
  }

  if (loading) return <DetailSkeleton />

  if (!resume) {
    return <div className="text-center py-12 text-muted-foreground">Resume not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/resumes')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{resume.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" onClick={() => navigate(`/resumes/${id}/create-version`)}>
            Create Version
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parsed Content</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap break-words overflow-x-auto text-sm text-muted-foreground">
            {resume.parsedContent || 'No content parsed yet.'}
          </pre>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete "${resume.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
