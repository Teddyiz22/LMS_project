import { stats } from '../../data/landingData.js'

function StatisticsSection() {
  return (
    <section aria-label="EduFlow demonstration statistics" className="border-y border-slate-200 bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
        {stats.map(([value, label]) => <div className="px-4 py-5 text-center sm:px-6 sm:py-2" key={label}><p className="text-2xl font-bold tracking-tight text-[#2563EB] sm:text-3xl">{value}</p><p className="mt-1 text-sm text-[#64748B]">{label}</p></div>)}
      </div>
    </section>
  )
}

export default StatisticsSection
