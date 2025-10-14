'use client'

import Link from 'next/link'
import { Twitter, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 bg-white dark:bg-black text-muted-foreground dark:text-muted-foreground/80">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left: Copyright */}
        <p className="text-sm">&copy; {new Date().getFullYear()} SCA Foundation. All rights reserved.</p>

        {/* Center: Navigation Links */}
        <nav className="flex space-x-6 text-sm">
          <Link href="/" className="hover:text-primary dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary dark:hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/programs" className="hover:text-primary dark:hover:text-white transition-colors">
            Programs
          </Link>
          <Link href="/contact" className="hover:text-primary dark:hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right: Social Icons */}
        <div className="flex space-x-4">
          <Link href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground dark:text-muted-foreground/80 hover:text-primary dark:hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground dark:text-muted-foreground/80 hover:text-primary dark:hover:text-white transition-colors">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground dark:text-muted-foreground/80 hover:text-primary dark:hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
