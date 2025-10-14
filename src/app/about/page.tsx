'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import {
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  animate,
} from 'framer-motion'

/** ✅ AnimatedCounter: Scroll-triggered counting animation */
function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className = '',
}: {
  from?: number
  to: number
  duration?: number
  className?: string
}) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const motionValue = useMotionValue(from)
  const spring = useSpring(motionValue, { duration })
  const [currentValue, setCurrentValue] = useState(from)

  useEffect(() => {
    if (inView) {
      animate(motionValue, to, { duration })
    }
  }, [inView, to, duration, motionValue])

  useMotionValueEvent(spring, 'change', (latest) => {
    setCurrentValue(Math.floor(latest))
  })

  return (
    <span ref={ref} className={className}>
      {currentValue.toLocaleString()}
    </span>
  )
}

export default function AboutPage() {

  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SCA Foundation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn more about our mission, vision, and the values that drive us to create a better future for communities around the world.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            At SCA Foundation, our mission is to empower underserved communities through education,
            healthcare, and sustainable development programs. We strive to create lasting change by
            working closely with local partners and supporting grassroots initiatives.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            We envision a world where every individual has the opportunity to live a dignified,
            healthy, and empowered life — regardless of their background or circumstances.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Compassion:</strong> Acting with empathy and kindness.</li>
            <li><strong>Integrity:</strong> Transparent, accountable, and ethical.</li>
            <li><strong>Collaboration:</strong> Working with communities for solutions.</li>
            <li><strong>Empowerment:</strong> Providing tools for self-sufficiency and growth.</li>
          </ul>
        </div>
      </section>

      {/* Impact Section with Animated Counters */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Impact So Far</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-muted-foreground">
            <div>
              <p className="text-5xl font-bold text-primary mb-2">
                <AnimatedCounter to={10000} duration={2} />+
              </p>
              <p>Children Educated</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">
                <AnimatedCounter to={5000} duration={2} />+
              </p>
              <p>Medical Treatments Provided</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">
                <AnimatedCounter to={150} duration={2} />+
              </p>
              <p>Communities Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Want to Get Involved?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Whether you donate, volunteer, or spread the word — your support makes a difference.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/donate">
            <Button size="lg" variant="default" className="!text-white">
              Donate Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
