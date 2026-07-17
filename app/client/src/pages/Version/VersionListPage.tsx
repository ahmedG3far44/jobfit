import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { resumesApi } from '@/lib/api/resumes'
import { versionsApi } from '@/lib/api/versions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/skeleton'
import { StatusDropdown } from '@/components/resume/StatusDropdown'
import { GitBranch } from 'lucide-react'
import type { Resume, ResumeVersion, VersionStatus } from '@/types'

export function VersionListPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { toast } = useToast()
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

  const handleStatusChange = async (versionId: string, status: VersionStatus) => {
    if (!token) return
    const prevStatus = versions.find((v) => v._id === versionId)?.status ?? 'applied'
    setVersions((prev) =>
      prev.map((v) => (v._id === versionId ? { ...v, status } : v))
    )
    try {
      await versionsApi.update(versionId, { status } as Partial<ResumeVersion>, token)
      toast('Status updated', 'success')
    } catch {
      setVersions((prev) =>
        prev.map((v) => (v._id === versionId ? { ...v, status: prevStatus } : v))
      )
      toast('Failed to update status', 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Resume Versions</h1>
        <TableSkeleton rows={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resume Versions</h1>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GitBranch className="mx-auto h-8 w-8 mb-3" />
            <p>No versions yet</p>
            <p className="text-sm mt-1">Upload a resume and create your first tailored version.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {versions.map((version) => {
            return (
              <Card key={version._id} className="transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => navigate(`/versions/${version._id}`)}
                      className="text-left min-w-0 cursor-pointer"
                    >
                      <CardTitle className="text-lg truncate underline-offset-4 decoration-muted-foreground/30 hover:underline hover:opacity-70 transition-all">
                        {version.name}
                      </CardTitle>
                    </button>
                    <div className="shrink-0">
                      <StatusDropdown
                        value={version.status || 'applied'}
                        onChange={(val) => handleStatusChange(version._id, val)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs shrink-0">{version.company}</Badge>
                    <span className="hidden xs:inline">&middot;</span>
                    <span className="truncate">
                      {resumes.find((r) => r._id === version.resumeId)?.title || version.jobTitle}
                    </span>
                    <span>&middot;</span>
                    <span className="whitespace-nowrap">Created {new Date(version.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
