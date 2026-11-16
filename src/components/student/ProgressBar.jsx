function ProgressBar({ className = '', value }) {
  return <div aria-label={`${value}% complete`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={value} className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar"><div className="h-full rounded-full bg-[#2563EB] transition-[width] duration-300" style={{ width: `${value}%` }} /></div>
}

export default ProgressBar
