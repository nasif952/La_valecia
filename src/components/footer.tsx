'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/catalog?sort=newest' },
    { name: 'Drop Shoulder Collection', href: '/catalog?category=drop-shoulder' },
    { name: 'Wintery Essentials', href: '/catalog?category=wintery' },
    { name: 'Accessories', href: '/catalog?category=accessories' },
    { name: 'Sale', href: '/catalog?sale=true' },
  ],
  support: [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/lavalecia', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/lavalecia', icon: Twitter },
  { name: 'Facebook', href: 'https://facebook.com/lavalecia', icon: Facebook },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <img
                  src="/images/logo/logo.jpg"
                  alt="La Valecia Logo"
                  className="h-12 w-auto object-contain transition-all duration-300 hover:brightness-110 hover:drop-shadow-lg"
                />
                <span className="text-2xl font-bold text-gradient">
                  La Valecia
                </span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Premium, futuristic apparel for the modern generation. Discover our latest 
                Drop Shoulder collection and Wintery essentials designed for style and comfort.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>hello@lavalecia.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>+880 1234 567890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest drops and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-brand-primary text-white rounded-2xl hover:bg-brand-primary/90 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex space-x-6 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-300 hover:text-brand-primary transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm text-gray-300">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-brand-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 md:mt-0 text-sm text-gray-400">
            © 2024 La Valecia. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
