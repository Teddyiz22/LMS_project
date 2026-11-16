import { categories } from '../../data/landingData.js'
import CategoryCard from './CategoryCard.jsx'

function CategoriesSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20" id="categories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">Learn without limits</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">Explore Top Categories</h2><p className="mt-4 text-base leading-7 text-[#64748B]">Find the right course for your interests and career goals.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <CategoryCard category={category} key={category.name} />)}</div>
      </div>
    </section>
  )
}

export default CategoriesSection
