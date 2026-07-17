import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { resumesApi } from '@/lib/api/resumes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Plus, FileText } from 'lucide-react'
import type { Resume } from '@/types'

export function ResumeListPage() {
  const { token } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    resumesApi.getAll(token)
      .then(setResumes)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Resumes</h1>
        </div>
        <TableSkeleton rows={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Link to="/resumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-8 w-8 mb-3" />
            <p>No resumes yet</p>
            <p className="text-sm mt-1">Upload your first resume to get started.</p>
            <Link to="/resumes/new">
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Link key={resume._id} to={`/resumes/${resume._id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{resume.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
