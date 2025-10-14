'use client'

import Link from 'next/link'
import { GraduationCap, Stethoscope, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

const programs = [
  {
    title: 'Education for All',
    description:
      'We provide free learning materials, build schools, and support teachers to ensure quality education for children in underserved areas.',
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    href: '/programs/education',
  },
  {
    title: 'Healthcare Access',
    description:
      'Medical camps, mobile clinics, and healthcare training for communities with little or no access to basic health services.',
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    href: '/programs/healthcare',
  },
  {
    title: 'Sustainability Initiatives',
    description:
      'Supporting clean water projects, renewable energy, and sustainable agriculture to help communities thrive independently.',
    icon: <Leaf className="h-8 w-8 text-primary" />,
    href: '/programs/sustainability',
  },
]

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground dark:text-white transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how the SCA Foundation is impacting lives through dedicated and sustainable
            programs focused on education, healthcare, and community development.
          </p>
        </div>
      </section>

      {/* Program Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {programs.map((program, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-950 border border-border rounded-lg shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </div>
              <div className="mt-6">
                <Link href={program.href}>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
