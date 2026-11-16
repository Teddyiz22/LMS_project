import { Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/landingData.js'
import Avatar from '../ui/Avatar.jsx'

function TestimonialsSection() {
  return (
    <section className="bg-white py-16 sm:py-20" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">Learner stories</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">What Our Students Say</h2></div><div className="mt-10 grid gap-6 lg:grid-cols-3">{testimonials.map((testimonial) => <figure className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6" key={testimonial.name}><Quote className="size-8 text-blue-200" aria-hidden="true" /><blockquote className="mt-4 text-base leading-7 text-[#1E293B]">“{testimonial.quote}”</blockquote><div className="mt-5 flex items-center gap-3"><Avatar name={testimonial.name} src={testimonial.image} /><figcaption><p className="font-semibold text-[#1E293B]">{testimonial.name}</p><p className="mt-0.5 text-xs text-[#64748B]">{testimonial.course}</p><span className="mt-1.5 flex gap-0.5 text-[#F59E0B]">{Array.from({ length: 5 }).map((_, index) => <Star className="size-3 fill-current" key={index} aria-hidden="true" />)}</span></figcaption></div></figure>)}</div><p className="mt-6 text-center text-xs text-[#64748B]">Testimonials are fictional demonstration content.</p></div>
    </section>
  )
}

export default TestimonialsSection
