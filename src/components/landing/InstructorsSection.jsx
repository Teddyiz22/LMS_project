import { instructors } from '../../data/landingData.js'
import InstructorCard from './InstructorCard.jsx'

function InstructorsSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20" id="instructors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">Learn from practitioners</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">Meet Our Instructors</h2><p className="mt-4 text-base leading-7 text-[#64748B]">Demonstration profiles from the kind of experts who make learning practical and relevant.</p></div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{instructors.map((instructor) => <InstructorCard instructor={instructor} key={instructor.name} />)}</div></div>
    </section>
  )
}

export default InstructorsSection
