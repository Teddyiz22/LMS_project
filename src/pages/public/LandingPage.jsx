import BackToTopButton from '../../components/landing/BackToTopButton.jsx'
import CategoriesSection from '../../components/landing/CategoriesSection.jsx'
import CTASection from '../../components/landing/CTASection.jsx'
import FeaturedCourses from '../../components/landing/FeaturedCourses.jsx'
import HeroSection from '../../components/landing/HeroSection.jsx'
import InstructorsSection from '../../components/landing/InstructorsSection.jsx'
import LandingFooter from '../../components/landing/LandingFooter.jsx'
import StatisticsSection from '../../components/landing/StatisticsSection.jsx'
import TestimonialsSection from '../../components/landing/TestimonialsSection.jsx'
import WhyChooseUs from '../../components/landing/WhyChooseUs.jsx'
import LandingNavbar from '../../components/navigation/LandingNavbar.jsx'

function LandingPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatisticsSection />
        <CategoriesSection />
        <FeaturedCourses />
        <WhyChooseUs />
        <InstructorsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
      <BackToTopButton />
    </div>
  )
}

export default LandingPage
