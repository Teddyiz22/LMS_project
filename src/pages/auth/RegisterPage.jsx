import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import RoleSelector from '../../components/auth/RoleSelector.jsx'
import Button from '../../components/ui/Button.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')

  return <AuthLayout description="Choose the account type that best fits how you want to learn with EduFlow." footer={<>Already have an account? <Link className="font-semibold text-[#2563EB] hover:text-blue-700" to="/login">Sign in</Link></>} title="Create your account"><form className="space-y-6" onSubmit={(event) => { event.preventDefault(); navigate(`/register/${role}`) }}><RoleSelector onChange={setRole} value={role} /><Button className="w-full" type="submit">Continue as {role === 'student' ? 'Student' : 'Teacher'}</Button></form></AuthLayout>
}

export default RegisterPage
