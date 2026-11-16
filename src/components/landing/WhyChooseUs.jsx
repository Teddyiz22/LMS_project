import { benefits } from '../../data/landingData.js'

function WhyChooseUs() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20" id="why-eduflow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-[#38BDF8]">Built around your growth</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Learn With EduFlow?</h2><p className="mt-4 text-base leading-7 text-slate-400">Everything you need to make meaningful progress, without the noise.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(({ icon: Icon, title, description }) => <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5" key={title}><span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-[#38BDF8]"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></article>)}</div>
      </div>
    </section>
  )
}

export default WhyChooseUs
