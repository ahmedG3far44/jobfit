import { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTheme } from '@/context/ThemeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { authApi } from '@/lib/api/auth'
import { Plus, X, Globe, Link as LinkIcon, Save, Camera, Loader2 } from 'lucide-react'
import type { ContactType, ContactLink } from '@/types'

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'behance', label: 'Behance' },
  { value: 'other', label: 'Other' },
]

const PHONE_COUNTRY_CODES = [
  { code: '20', label: 'EG +20' },
  { code: '213', label: 'DZ +213' },
  { code: '216', label: 'TN +216' },
  { code: '218', label: 'LY +218' },
  { code: '249', label: 'SD +249' },
  { code: '44', label: 'UK +44' },
  { code: '1', label: 'US/CA +1' },
  { code: '7', label: 'RU +7' },
  { code: '33', label: 'FR +33' },
  { code: '34', label: 'ES +34' },
  { code: '39', label: 'IT +39' },
  { code: '49', label: 'DE +49' },
  { code: '31', label: 'NL +31' },
  { code: '32', label: 'BE +32' },
  { code: '41', label: 'CH +41' },
  { code: '46', label: 'SE +46' },
  { code: '47', label: 'NO +47' },
  { code: '45', label: 'DK +45' },
  { code: '358', label: 'FI +358' },
  { code: '48', label: 'PL +48' },
  { code: '43', label: 'AT +43' },
  { code: '30', label: 'GR +30' },
  { code: '351', label: 'PT +351' },
  { code: '353', label: 'IE +353' },
  { code: '61', label: 'AU +61' },
  { code: '64', label: 'NZ +64' },
  { code: '81', label: 'JP +81' },
  { code: '82', label: 'KR +82' },
  { code: '86', label: 'CN +86' },
  { code: '852', label: 'HK +852' },
  { code: '65', label: 'SG +65' },
  { code: '60', label: 'MY +60' },
  { code: '66', label: 'TH +66' },
  { code: '84', label: 'VN +84' },
  { code: '63', label: 'PH +63' },
  { code: '91', label: 'IN +91' },
  { code: '92', label: 'PK +92' },
  { code: '966', label: 'SA +966' },
  { code: '971', label: 'AE +971' },
  { code: '974', label: 'QA +974' },
  { code: '965', label: 'KW +965' },
  { code: '973', label: 'BH +973' },
  { code: '968', label: 'OM +968' },
  { code: '962', label: 'JO +962' },
  { code: '961', label: 'LB +961' },
  { code: '972', label: 'IL +972' },
  { code: '90', label: 'TR +90' },
  { code: '27', label: 'ZA +27' },
  { code: '234', label: 'NG +234' },
  { code: '254', label: 'KE +254' },
  { code: '233', label: 'GH +233' },
  { code: '55', label: 'BR +55' },
  { code: '52', label: 'MX +52' },
  { code: '54', label: 'AR +54' },
  { code: '56', label: 'CL +56' },
  { code: '57', label: 'CO +57' },
]

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Egypt',
  'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'Iceland',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
  'Lebanon', 'Libya', 'Luxembourg',
  'Malaysia', 'Maldives', 'Malta', 'Mexico', 'Monaco', 'Morocco',
  'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
  'Oman',
  'Pakistan', 'Palestine', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia',
  'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Thailand', 'Tunisia', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam',
  'Yemen',
]

function parsePhone(phone: string): { code: string; number: string } {
  const match = phone.match(/^\+(\d+)\s*(.*)$/)
  if (match) return { code: match[1], number: match[2].trim() }
  return { code: '20', number: phone }
}

export function SettingsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || '')
  const parsedPhone = parsePhone(user?.phone || '')
  const [phoneCode, setPhoneCode] = useState(parsedPhone.code)
  const [phoneNumber, setPhoneNumber] = useState(parsedPhone.number)
  const [contacts, setContacts] = useState<ContactLink[]>(user?.contacts || [])
  const [globalLocation, setGlobalLocation] = useState(user?.globalLocation || '')
  const [localLocation, setLocalLocation] = useState(user?.localLocation || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAddContact = () => {
    setContacts([...contacts, { type: 'linkedin', value: '' }])
  }

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const handleContactChange = (index: number, field: keyof ContactLink, val: string) => {
    const updated = contacts.map((c, i) =>
      i === index ? { ...c, [field]: val } : c
    )
    setContacts(updated)
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append('avatar', file)
    authApi.uploadProfilePicture(formData, token)
      .then(() => {
        toast('Profile picture updated', 'success')
        URL.revokeObjectURL(previewUrl)
        setAvatarPreview(null)
      })
      .catch(() => toast('Failed to upload picture', 'error'))
      .finally(() => setUploadingAvatar(false))
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    try {
      const phone = phoneNumber ? `+${phoneCode} ${phoneNumber}` : ''
      await authApi.updateProfile({ name, phone, contacts, globalLocation, localLocation }, token)
      toast('Profile saved', 'success')
    } catch {
      toast('Failed to save profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = avatarPreview || user?.profilePicture || null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ${!editing ? 'opacity-60' : ''} bg-muted`}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                {editing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow hover:bg-accent transition-colors"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Camera className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarSelect}
                    />
                  </>
                )}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.email}</p>
                {editing && <p className="text-muted-foreground">JPG, PNG or WebP up to 5MB</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className={!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex gap-2">
                <Select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  options={PHONE_COUNTRY_CODES.map((c) => ({ value: c.code, label: c.label }))}
                  disabled={!editing}
                  className={`w-36 shrink-0 ${!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}`}
                />
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!editing}
                  placeholder="123 456 789"
                  className={`flex-1 ${!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Links and location that will appear on your resume versions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  Profile Links
                </Label>
                {editing && (
                  <Button variant="outline" size="sm" onClick={handleAddContact}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Link
                  </Button>
                )}
              </div>

              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No links added yet</p>
              )}

              {contacts.map((contact, i) => (
                <div key={i} className="flex flex-wrap items-start gap-2">
                  <div className="flex-1 min-w-[120px]">
                    <Select
                      value={contact.type}
                      onChange={(e) => handleContactChange(i, 'type', e.target.value)}
                      options={CONTACT_TYPES}
                      disabled={!editing}
                      className={!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}
                    />
                  </div>
                  <div className="flex-[2] min-w-[180px]">
                    <Input
                      value={contact.value}
                      onChange={(e) => handleContactChange(i, 'value', e.target.value)}
                      disabled={!editing}
                      placeholder="https://..."
                      className={!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}
                    />
                  </div>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => handleRemoveContact(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Location
              </Label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Global (Remote-ready countries)</Label>
                  <Select
                    value={globalLocation}
                    onChange={(e) => setGlobalLocation(e.target.value)}
                    disabled={!editing}
                    options={[{ value: '', label: 'Select country...' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
                    className={!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Local (City, Country)</Label>
                  <Input
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    disabled={!editing}
                    placeholder="e.g. Alexandria, Egypt"
                    className={!editing ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' : ''}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={toggleTheme}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          variant={editing ? 'outline' : 'default'}
          size="lg"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
        {editing && (
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  )
}
