import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Chatbot } from '@/components/chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'La Valecia - Premium Apparel',
  description: 'Discover premium, futuristic apparel for the modern generation. Shop our latest Drop Shoulder collection and Wintery essentials.',
  keywords: ['fashion', 'apparel', 'premium', 'clothing', 'La Valecia', 'drop shoulder', 'wintery'],
  authors: [{ name: 'La Valecia' }],
  creator: 'La Valecia',
  publisher: 'La Valecia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://la-valecia-ecommerce.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://la-valecia-ecommerce.vercel.app',
    title: 'La Valecia - Premium Apparel',
    description: 'Discover premium, futuristic apparel for the modern generation.',
    siteName: 'La Valecia',
    images: [
      {
        url: '/images/logo/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'La Valecia - Premium Apparel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Valecia - Premium Apparel',
    description: 'Discover premium, futuristic apparel for the modern generation.',
    images: ['/images/logo/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}
