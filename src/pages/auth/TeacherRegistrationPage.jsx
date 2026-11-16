import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/auth/AuthInput.jsx'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import PasswordInput from '../../components/auth/PasswordInput.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function TeacherRegistrationPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', title: '', biography: '', terms: false })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name.'
    if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'
    if (form.title.trim().length < 2) nextErrors.title = 'Add your professional title.'
    if (form.biography.trim().length < 20) nextErrors.biography = 'Write at least 20 characters about your experience.'
    if (!form.terms) nextErrors.terms = 'You must accept the terms to continue.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setIsLoading(true)
    try { await register({ ...form, role: 'teacher' }); navigate('/dashboard-preview', { replace: true }) } finally { setIsLoading(false) }
  }

  return <AuthLayout description="Tell learners a little about your expertise while creating your teacher account." footer={<>Already have an account? <Link className="font-semibold text-[#2563EB] hover:text-blue-700" to="/login">Sign in</Link></>} title="Join as a teacher"><form className="space-y-4" noValidate onSubmit={handleSubmit}><AuthInput autoComplete="name" error={errors.fullName} label="Full name" name="fullName" onChange={updateField} placeholder="Alex Morgan" value={form.fullName} /><AuthInput autoComplete="email" error={errors.email} label="Email address" name="email" onChange={updateField} placeholder="you@example.com" type="email" value={form.email} /><PasswordInput autoComplete="new-password" error={errors.password} name="password" onChange={updateField} value={form.password} /><PasswordInput autoComplete="new-password" error={errors.confirmPassword} label="Confirm password" name="confirmPassword" onChange={updateField} value={form.confirmPassword} /><AuthInput error={errors.title} label="Professional title" name="title" onChange={updateField} placeholder="Senior Product Designer" value={form.title} /><AuthInput as="textarea" error={errors.biography} label="Short biography" name="biography" onChange={updateField} placeholder="Share your professional experience and the topics you teach..." value={form.biography} /><div><label className="flex items-start gap-2 text-sm leading-5 text-[#64748B]"><input checked={form.terms} className="mt-0.5 size-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]" name="terms" onChange={updateField} type="checkbox" />I agree to the demonstration platform terms and privacy policy.</label>{errors.terms && <p className="mt-1.5 text-xs text-[#EF4444]">{errors.terms}</p>}</div><Button className="w-full" isLoading={isLoading} type="submit">Create teacher account</Button><p className="text-center text-sm text-[#64748B]">Want to learn? <Link className="font-medium text-[#2563EB] hover:text-blue-700" to="/register/student">Register as a student</Link></p></form></AuthLayout>
}

export default TeacherRegistrationPage
