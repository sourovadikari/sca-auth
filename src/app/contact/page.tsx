'use client'

import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, idea, or just want to chat? We’re here for it. Reach out anytime!
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPin className="text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p className="text-muted-foreground">
                123 SCA Foundation Lane, Hope City, HC 45678
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-muted-foreground">+1 (800) 123-4567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-muted-foreground">contact@scafoundation.org</p>
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded overflow-hidden mt-10 shadow border border-border">
            <iframe
              title="SCA Foundation Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609927155!2d72.74109997208774!3d19.08219783802671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63c06f44b4b%3A0xc5f2d221cc1e57ec!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1695048723246!5m2!1sen!2sus"
              width="100%"
              height="250"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full"
            />
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <Input id="name" type="text" placeholder="Jane Doe" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input id="email" type="email" placeholder="jane@example.com" required />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea id="message" rows={5} placeholder="Write your message here..." required />
          </div>

          <Button type="submit" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </Button>
        </form>
      </section>
    </main>
  )
}
