import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/auth/AuthInput.jsx'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import PasswordInput from '../../components/auth/PasswordInput.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setFormError('')
    setIsLoading(true)
    try {
      const authenticatedUser = await login(form)
      navigate(location.state?.from?.pathname ?? (authenticatedUser.role === 'student' ? '/student/dashboard' : '/dashboard-preview'), { replace: true })
    } catch {
      setFormError('Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthLayout description="Welcome back. Sign in to continue your learning journey." footer={<>New to EduFlow? <Link className="font-semibold text-[#2563EB] hover:text-blue-700" to="/register">Create an account</Link></>} title="Welcome back"><form className="space-y-5" noValidate onSubmit={handleSubmit}>{formError && <p className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#EF4444]" role="alert"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{formError}</p>}<AuthInput autoComplete="email" error={errors.email} label="Email address" name="email" onChange={updateField} placeholder="you@example.com" type="email" value={form.email} /><PasswordInput autoComplete="current-password" error={errors.password} name="password" onChange={updateField} value={form.password} /><div className="flex items-center justify-between gap-3"><label className="inline-flex items-center gap-2 text-sm text-[#64748B]"><input checked={form.remember} className="size-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]" name="remember" onChange={updateField} type="checkbox" />Remember me</label><Link className="text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/forgot-password">Forgot password?</Link></div><Button className="w-full" isLoading={isLoading} type="submit">Sign in</Button></form></AuthLayout>
}

export default LoginPage
