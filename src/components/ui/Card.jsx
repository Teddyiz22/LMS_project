function Card({ actions, children, className = '', description, title }) {
  const hasHeader = title || description || actions

  return (
    <section className={`rounded-xl border border-[#E2E8F0] bg-white shadow-sm ${className}`}>
      {hasHeader && (
        <header className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-base font-semibold text-[#1E293B]">{title}</h2>}
            {description && <p className="mt-1 text-sm text-[#64748B]">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}
      {children && <div className="p-5">{children}</div>}
    </section>
  )
}

export default Card
