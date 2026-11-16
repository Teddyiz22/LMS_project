import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthInput from '../../components/auth/AuthInput.jsx'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const response = await requestPasswordReset(email)
      setSuccess(`${response.message} This is a mock frontend flow; no email was sent.`)
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthLayout description="Enter your email and we will guide you through the password reset process." footer={<Link className="font-semibold text-[#2563EB] hover:text-blue-700" to="/login">Back to sign in</Link>} title="Reset your password">{success ? <div className="space-y-5"><div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800" role="status"><CheckCircle2 className="mb-2 size-5 text-[#22C55E]" aria-hidden="true" />{success}</div><Button className="w-full" to="/login">Return to sign in</Button></div> : <form className="space-y-5" noValidate onSubmit={handleSubmit}><AuthInput autoComplete="email" error={error} label="Email address" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" type="email" value={email} /><Button className="w-full" isLoading={isLoading} type="submit">Send reset link</Button></form>}</AuthLayout>
}

export default ForgotPasswordPage
