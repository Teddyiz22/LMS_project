import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import AuthInput from './AuthInput.jsx'

function PasswordInput({ error, label = 'Password', ...props }) {
  const [isVisible, setIsVisible] = useState(false)

  return <div className="relative"><AuthInput className="pr-11" error={error} label={label} type={isVisible ? 'text' : 'password'} {...props} /><button aria-label={isVisible ? 'Hide password' : 'Show password'} className="absolute right-3 top-8 rounded p-1 text-slate-400 transition hover:text-[#2563EB] focus-visible:outline-2 focus-visible:outline-[#2563EB]" onClick={() => setIsVisible((visible) => !visible)} type="button">{isVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}</button></div>
}

export default PasswordInput
