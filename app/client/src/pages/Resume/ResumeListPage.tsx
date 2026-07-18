import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { resumesApi } from '@/lib/api/resumes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Plus, FileText, GitBranch } from 'lucide-react'
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
      <div className="flex flex-wrap items-center justify-between gap-4">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link key={resume._id} to={`/resumes/${resume._id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(resume.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <GitBranch className="h-3 w-3 shrink-0" />
                    <span>{resume.versionCount ?? 0} version{resume.versionCount !== 1 ? 's' : ''}</span>
                    {(resume.versionCompanies ?? []).length > 0 && (
                      <span className="truncate text-[10px] opacity-70">
                        — {resume.versionCompanies!.join(', ')}
                      </span>
                    )}
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
