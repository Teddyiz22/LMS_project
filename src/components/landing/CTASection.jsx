import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button.jsx'

function CTASection() {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20" id="get-started">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="overflow-hidden rounded-2xl bg-[#2563EB] px-6 py-12 text-center shadow-xl shadow-blue-900/15 sm:px-12 sm:py-16"><p className="text-sm font-semibold uppercase tracking-wider text-blue-200">Your next chapter starts here</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Start Your Learning Journey Today</h2><p className="mx-auto mt-4 max-w-xl text-base leading-7 text-blue-100">Join EduFlow and discover new opportunities through online learning.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button className="bg-white text-[#2563EB] hover:bg-blue-50 focus-visible:outline-white" href="#featured-courses" size="lg">Get Started <ArrowRight className="size-4" aria-hidden="true" /></Button><Button className="border-blue-300 bg-transparent text-white hover:bg-blue-700 focus-visible:outline-white" href="#featured-courses" size="lg" variant="outline">Explore Courses</Button></div></div></div>
    </section>
  )
}

export default CTASection
