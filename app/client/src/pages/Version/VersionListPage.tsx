import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { versionsApi } from '@/lib/api/versions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/skeleton'
import { GitBranch } from 'lucide-react'
import type { ResumeVersion } from '@/types'

export function VersionListPage() {
  const { token } = useAuth()
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    versionsApi.getAll(token)
      .then(setVersions)
      .finally(() => setLoading(false))
  }, [token])

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
        <div className="grid gap-4">
          {versions.map((version) => (
            <Link key={version._id} to={`/versions/${version._id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{version.name}</CardTitle>
                    <Badge>{version.company}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {version.jobTitle} &middot; Created {new Date(version.createdAt).toLocaleDateString()}
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
