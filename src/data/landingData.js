import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Database,
  Layers3,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket,
  Sparkles,
  Timer,
} from 'lucide-react'

export const categories = [
  { icon: Code2, name: 'Programming', courses: '84 courses', description: 'Build software with confidence.' },
  { icon: MonitorSmartphone, name: 'Web Development', courses: '72 courses', description: 'Create modern web experiences.' },
  { icon: PenTool, name: 'UI/UX Design', courses: '46 courses', description: 'Design products people enjoy.' },
  { icon: Palette, name: 'Graphic Design', courses: '38 courses', description: 'Bring visual ideas to life.' },
  { icon: BriefcaseBusiness, name: 'Business', courses: '59 courses', description: 'Lead teams and grow ideas.' },
  { icon: Database, name: 'Data Science', courses: '51 courses', description: 'Turn data into decisions.' },
]

export const courses = [
  { title: 'Complete Web Development Bootcamp', instructor: 'Maya Chen', category: 'Web Development', rating: '4.9', students: '12,480', duration: '42h 30m', price: '$49', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80' },
  { title: 'Python Programming for Beginners', instructor: 'Daniel Foster', category: 'Programming', rating: '4.8', students: '9,204', duration: '28h 15m', price: 'Free', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80' },
  { title: 'UI/UX Design with Figma', instructor: 'Sofia Martinez', category: 'UI/UX Design', rating: '4.9', students: '7,891', duration: '18h 45m', price: '$39', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80' },
  { title: 'JavaScript Advanced Development', instructor: 'Noah Williams', category: 'Programming', rating: '4.7', students: '6,328', duration: '31h 20m', price: '$45', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=900&q=80' },
  { title: 'Data Analysis with Python', instructor: 'Priya Shah', category: 'Data Science', rating: '4.8', students: '8,167', duration: '24h 10m', price: '$42', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80' },
  { title: 'Graphic Design Fundamentals', instructor: 'Jordan Lee', category: 'Graphic Design', rating: '4.6', students: '5,645', duration: '16h 40m', price: '$35', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80' },
]

export const benefits = [
  { icon: Sparkles, title: 'Expert Instructors', description: 'Learn from experienced professionals who bring real-world context to every lesson.' },
  { icon: Timer, title: 'Flexible Learning', description: 'Learn at your own pace, on your schedule, from any device.' },
  { icon: Rocket, title: 'Practical Projects', description: 'Build portfolio-ready work that turns new knowledge into useful skills.' },
  { icon: BarChart3, title: 'Learning Progress Tracking', description: 'Stay motivated with a clear view of your progress and achievements.' },
]

export const instructors = [
  { name: 'Maya Chen', specialty: 'Full-Stack Developer', courses: '12 courses', intro: 'Helping aspiring developers build thoughtful, production-ready web apps.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { name: 'Daniel Foster', specialty: 'Data & Python Instructor', courses: '9 courses', intro: 'Making technical concepts approachable through practical, hands-on learning.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sofia Martinez', specialty: 'Product Designer', courses: '8 courses', intro: 'Teaching designers to create clear, useful experiences that people love.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Priya Shah', specialty: 'Data Analyst', courses: '10 courses', intro: 'Empowering learners to uncover meaningful stories in data.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80' },
]

export const testimonials = [
  { name: 'Amelia Grant', course: 'Complete Web Development Bootcamp', quote: 'EduFlow gave me a clear path from learning the basics to building projects I was proud to share.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80' },
  { name: 'Ethan Brooks', course: 'Data Analysis with Python', quote: 'The practical exercises made everything click. I now use these skills in my work every week.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80' },
  { name: 'Nora Kim', course: 'UI/UX Design with Figma', quote: 'The lessons are focused, polished, and easy to fit around a busy schedule.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80' },
]

export const stats = [
  ['10,000+', 'Active Students'],
  ['500+', 'Online Courses'],
  ['100+', 'Expert Instructors'],
  ['95%', 'Student Satisfaction'],
]

export const learningIllustration = Layers3
