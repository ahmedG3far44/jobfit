import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { resumesApi } from '@/lib/api/resumes'
import { versionsApi } from '@/lib/api/versions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, GitBranch, FileSignature, Plus, Upload } from 'lucide-react'
import type { Resume, ResumeVersion } from '@/types'

export function DashboardPage() {
  const { token } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    Promise.all([
      resumesApi.getAll(token),
      versionsApi.getAll(token),
    ]).then(([resumesData, versionsData]) => {
      setResumes(resumesData)
      setVersions(versionsData)
    }).finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/resumes/new">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Master Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume Versions</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{versions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Master Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No resumes yet</p>
                <Link to="/resumes/new">
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload your first resume
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <Link key={resume._id} to={`/resumes/${resume._id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div>
                        <p className="font-medium">{resume.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{resume.originalFileUrl ? 'File' : 'Text'}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Versions</CardTitle>
          </CardHeader>
          <CardContent>
            {versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No versions yet</p>
                <p className="text-sm mt-1">Upload a resume and create your first tailored version</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.slice(0, 5).map((version) => (
                  <Link key={version._id} to={`/versions/${version._id}`}>
                    <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                      <p className="font-medium">{version.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {version.company} &middot; {version.jobTitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
