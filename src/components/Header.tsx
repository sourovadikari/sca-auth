'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const pathname = usePathname()

  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user

  useEffect(() => setMounted(true), [])

  // Scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
  }, [isMenuOpen])

  // Auto-close mobile menu on resize >= md
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen])

  const isDark = resolvedTheme === 'dark'

  const renderDesktopLink = (link: { name: string; href: string }) => {
    const isActive = pathname === link.href

    return (
      <Link
        key={link.href}
        href={link.href}
        className={clsx(
          'relative text-sm font-medium px-2 py-1 rounded transition-colors',
          isActive
            ? 'text-primary dark:text-white'
            : 'text-foreground/90 hover:text-primary dark:text-white/80 dark:hover:text-white'
        )}
      >
        {link.name}
        {isActive && (
          <motion.span
            layoutId="underline"
            className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    )
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-950 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-primary dark:text-white">
            SCA Cloud
          </Link>
        </div>

        {/* Center: Nav Links (desktop only) */}
        <nav className="hidden md:flex space-x-6">{navLinks.map(renderDesktopLink)}</nav>

        {/* Right: Donate, Login / User Dropdown, Theme Toggle (desktop only) */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/upload">
            <Button variant="default" size="sm">
              Upload
            </Button>
          </Link>

          {mounted && isLoggedIn ? (
            <UserDropdown user={session.user!} />
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Mobile: Hamburger + Theme Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-3/4 sm:w-1/2 bg-white dark:bg-gray-950 z-50 shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex justify-between items-center px-4 py-4 border-b border-border">
                <span className="text-lg font-bold text-primary dark:text-white">SCA Cloud</span>
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info for logged-in */}
              {isLoggedIn && (
                <div className="flex items-center space-x-3 px-4 py-4 border-b border-border">

                  <div>
                    <p className="text-base font-semibold text-foreground dark:text-white">
                      {session.user?.name ?? session.user?.email ?? 'User'}
                    </p>
                    <p className="text-sm text-foreground/70 dark:text-white/70">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <nav className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={clsx(
                        'text-md font-medium px-3 py-2 rounded transition-colors',
                        isActive
                          ? 'bg-gray-300 dark:bg-gray-800 text-black dark:text-white'
                          : 'text-foreground/90 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800 dark:hover:text-white'
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Buttons: Login (if logged out), Donate, Sign Out (if logged in) */}
            <div className="p-4 border-t border-border flex flex-col space-y-3">
              {!isLoggedIn && (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className={clsx('w-full', pathname === '/login')}
                    size="sm"
                  >
                    Login
                  </Button>
                </Link>
              )}

              <Link href="/upload" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="default"
                  className={clsx('w-full', pathname === '/donate' && 'ring-2 ring-primary ring-offset-2')}
                  size="sm"
                >
                  Upload
                </Button>
              </Link>

              {isLoggedIn && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700"
                  size="sm"
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

type UserDropdownProps = {
  user: {
    name?: string | null
    email?: string | null
  }
}

function UserDropdown({ user }: UserDropdownProps) {
  const [open, setOpen] = useState(false)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('#user-dropdown')) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <div id="user-dropdown" className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center space-x-2 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >

        <span className="hidden md:inline text-sm font-medium text-foreground dark:text-white">
          {user.name ?? user.email ?? 'User'}
        </span>
        <svg
          className={`h-4 w-4 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg z-50 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm ..."
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700 dark:text-red-400 dark:hover:text-red-200"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                signOut({ callbackUrl: '/' })
              }}
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
