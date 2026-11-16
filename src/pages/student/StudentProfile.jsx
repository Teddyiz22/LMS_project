import { CheckCircle2, Edit3, LockKeyhole, Save, UserRound } from 'lucide-react'
import { useState } from 'react'
import PasswordInput from '../../components/auth/PasswordInput.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { studentProfile } from '../../data/studentMockData.js'
import { useAuth } from '../../context/AuthContext.jsx'

function StudentProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({ ...studentProfile, fullName: user?.fullName || studentProfile.fullName, email: user?.email || studentProfile.email })
  const [savedMessage, setSavedMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const updateProfile = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleProfileSave = (event) => { event.preventDefault(); setIsEditing(false); setSavedMessage('Profile updates are shown locally for this demo and were not saved to a server.') }
  const handlePasswordSave = (event) => { event.preventDefault(); if (passwordForm.next.length < 8 || passwordForm.next !== passwordForm.confirm) { setPasswordMessage('Use a matching new password with at least 8 characters.'); return } setPasswordMessage('Password update is a demonstration only; no password was changed.') }

  return <div className="space-y-6"><PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Profile' }]} description="Manage the profile information shown in your student workspace." title="My Profile" /><section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]"><Card actions={<Button onClick={() => setIsEditing((editing) => !editing)} size="sm" variant="outline">{isEditing ? 'Cancel editing' : <><Edit3 className="size-4" aria-hidden="true" />Edit profile</>}</Button>} description="Your personal information for this demonstration workspace." title="Profile Information"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><Avatar className="size-20 text-xl" name={profile.fullName} src={profile.avatar} /><div><p className="text-lg font-semibold text-[#1E293B]">{profile.fullName}</p><p className="text-sm text-[#64748B]">{profile.program}</p><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#64748B]"><UserRound className="size-3.5" aria-hidden="true" />Member since {profile.joined}</p></div></div>{savedMessage && <p className="mt-5 flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800"><CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />{savedMessage}</p>}<form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleProfileSave}><Input disabled={!isEditing} label="Full name" name="fullName" onChange={updateProfile} value={profile.fullName} /><Input disabled={!isEditing} label="Email address" name="email" onChange={updateProfile} type="email" value={profile.email} /><div className="sm:col-span-2"><Input disabled={!isEditing} label="Learning path" name="program" onChange={updateProfile} value={profile.program} /></div><label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Biography</span><textarea className="min-h-28 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100" disabled={!isEditing} name="bio" onChange={updateProfile} value={profile.bio} /></label>{isEditing && <div className="sm:col-span-2"><Button type="submit"><Save className="size-4" aria-hidden="true" />Save changes</Button></div>}</form></Card><Card description="Use this UI to practice the future secure password flow." title="Change Password"><form className="space-y-4" onSubmit={handlePasswordSave}><PasswordInput label="Current password" name="current" onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))} value={passwordForm.current} /><PasswordInput label="New password" name="next" onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} value={passwordForm.next} /><PasswordInput label="Confirm new password" name="confirm" onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} value={passwordForm.confirm} />{passwordMessage && <p className={`rounded-lg p-3 text-sm ${passwordMessage.startsWith('Password update') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-[#EF4444]'}`}>{passwordMessage}</p>}<Button type="submit" variant="outline"><LockKeyhole className="size-4" aria-hidden="true" />Update password</Button></form></Card></section></div>
}

export default StudentProfile
