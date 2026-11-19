import { CheckCircle2, Edit3, LockKeyhole, Save, UserRound } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import PasswordInput from '../../components/auth/PasswordInput.jsx'
import { getProfile, updateProfile } from '../../services/studentService.js'
import { changePassword } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

function StudentProfile() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getProfile()
      setProfile(data)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  const updateProfileField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setSaveError('')
    setSavedMessage('')
    setIsSaving(true)
    try {
      const updated = await updateProfile(profile)
      setProfile(updated)
      setIsEditing(false)
      setSavedMessage('Profile saved.')
      if (updated?.fullName && user) {
        setUser({ ...user, fullName: updated.fullName })
      }
    } catch (saveErr) {
      setSaveError(saveErr.message || 'The profile could not be saved.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = async (event) => {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (passwordForm.next.length < 8 || passwordForm.next !== passwordForm.confirm) {
      setPasswordError('Use a matching new password with at least 8 characters.')
      return
    }
    setIsChangingPassword(true)
    try {
      await changePassword(passwordForm.current, passwordForm.next)
      setPasswordMessage('Password changed.')
      setPasswordForm({ current: '', next: '', confirm: '' })
    } catch (changeError) {
      setPasswordError(changeError.message || 'The password could not be changed.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const joinedLabel = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Profile' }]} description="Manage the profile information shown in your student workspace." title="My Profile" />
      {isLoading ? (
        <LoadingState label="Loading your profile…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadProfile} />
      ) : profile && (
        <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Card
            actions={<Button onClick={() => setIsEditing((editing) => !editing)} size="sm" variant="outline">{isEditing ? 'Cancel editing' : <><Edit3 className="size-4" aria-hidden="true" />Edit profile</>}</Button>}
            description="Your personal information for your learning records."
            title="Profile Information"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-20 text-xl" name={profile.fullName} src={profile.avatar || undefined} />
              <div>
                <p className="text-lg font-semibold text-[#1E293B]">{profile.fullName}</p>
                <p className="text-sm text-[#64748B]">{profile.program || 'Student'}</p>
                {joinedLabel && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                    <UserRound className="size-3.5" aria-hidden="true" />Member since {joinedLabel}
                  </p>
                )}
              </div>
            </div>
            {savedMessage && <p className="mt-5 flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800"><CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />{savedMessage}</p>}
            {saveError && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{saveError}</p>}
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleProfileSave}>
              <Input disabled={!isEditing} label="Full name" name="fullName" onChange={updateProfileField} value={profile.fullName || ''} />
              <Input disabled label="Email address" name="email" onChange={updateProfileField} type="email" value={profile.email || ''} />
              <div className="sm:col-span-2">
                <Input disabled={!isEditing} label="Learning path" name="program" onChange={updateProfileField} value={profile.program || ''} />
              </div>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Biography</span>
                <textarea className="min-h-28 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100" disabled={!isEditing} name="bio" onChange={updateProfileField} value={profile.bio || ''} />
              </label>
              {isEditing && (
                <div className="sm:col-span-2">
                  <Button isLoading={isSaving} type="submit"><Save className="size-4" aria-hidden="true" />Save changes</Button>
                </div>
              )}
            </form>
          </Card>
          <Card description="Choose a strong password you do not use anywhere else." title="Change Password">
            <form className="space-y-4" onSubmit={handlePasswordSave}>
              <PasswordInput label="Current password" name="current" onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))} value={passwordForm.current} />
              <PasswordInput label="New password" name="next" onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} value={passwordForm.next} />
              <PasswordInput label="Confirm new password" name="confirm" onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} value={passwordForm.confirm} />
              {passwordError && <p className="rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{passwordError}</p>}
              {passwordMessage && <p className="flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800"><CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />{passwordMessage}</p>}
              <Button isLoading={isChangingPassword} type="submit" variant="outline"><LockKeyhole className="size-4" aria-hidden="true" />Update password</Button>
            </form>
          </Card>
        </section>
      )}
    </div>
  )
}

export default StudentProfile
