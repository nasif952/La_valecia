'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/providers'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Catalog', href: '/catalog' },
  { name: 'Drop Shoulder', href: '/catalog?category=drop-shoulder' },
  { name: 'Wintery', href: '/catalog?category=wintery' },
  { name: 'Accessories', href: '/catalog?category=accessories' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { user, profile } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <img
                src="/images/logo/logo.jpg"
                alt="La Valecia Logo"
                className="h-10 w-auto object-contain transition-all duration-300 hover:brightness-110 hover:drop-shadow-lg"
              />
              <span className="text-2xl font-bold text-gradient">
                La Valecia
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-brand-primary",
                  pathname === item.href
                    ? "text-brand-primary"
                    : "text-gray-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <span className="hidden sm:block text-sm text-gray-700">
                  {profile?.name || user.email}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="premium" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Logo */}
                <div className="flex justify-center mb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <img
                      src="/images/logo/logo.jpg"
                      alt="La Valecia Logo"
                      className="h-8 w-auto object-contain transition-all duration-300 hover:brightness-110 hover:drop-shadow-lg"
                    />
                    <span className="text-xl font-bold text-gradient">
                      La Valecia
                    </span>
                  </Link>
                </div>
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200",
                        pathname === item.href
                          ? "text-brand-primary bg-brand-primary/10"
                          : "text-gray-700 hover:text-brand-primary hover:bg-gray-50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile User Actions */}
                {!user && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button variant="premium" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
