'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'
import Link from 'next/link'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure payment processing',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
]

// Fallback featured products
const fallbackFeaturedProducts = [
  {
    id: '1',
    name: 'Drop Shoulder Hoodie - Classic',
    price: 399,
    image: '/images/products/drop-shoulder-1.jpg',
    category: 'Drop Shoulder',
  },
  {
    id: '2',
    name: 'Drop Shoulder Hoodie - Premium',
    price: 399,
    image: '/images/products/drop-shoulder-2.jpg',
    category: 'Drop Shoulder',
  },
  {
    id: '3',
    name: 'Drop Shoulder Hoodie - Modern',
    price: 399,
    image: '/images/products/drop-shoulder-3.jpg',
    category: 'Drop Shoulder',
  },
  {
    id: '4',
    name: 'Drop Shoulder Hoodie - Elite',
    price: 399,
    image: '/images/products/drop-shoulder-4.jpg',
    category: 'Drop Shoulder',
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState(fallbackFeaturedProducts)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_path, sort)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.warn('Database error, using fallback products:', error)
        setFeaturedProducts(fallbackFeaturedProducts)
      } else if (data && data.length > 0) {
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price_cents,
          image: product.product_images?.[0]?.image_path || '/api/placeholder/400/500',
          category: 'Drop Shoulder', // You might want to join with categories table
        }))
        setFeaturedProducts(transformedProducts)
      } else {
        setFeaturedProducts(fallbackFeaturedProducts)
      }
    } catch (error) {
      console.warn('Error fetching featured products, using fallback:', error)
      setFeaturedProducts(fallbackFeaturedProducts)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Premium{' '}
                <span className="text-gradient">Futuristic</span>{' '}
                Apparel
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover our latest Drop Shoulder collection and Wintery essentials. 
                Designed for the modern generation who values style, comfort, and innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalog">
                  <Button size="xl" className="w-full sm:w-auto">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/catalog?category=drop-shoulder">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Drop Shoulder Collection
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-3xl overflow-hidden">
                <img
                  src="/images/products/drop-shoulder-1.jpg"
                  alt="La Valecia Hero - Drop Shoulder Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">"Amazing quality and style!"</p>
                <p className="text-xs text-gray-500">- Sarah M.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-2xl mb-4">
                  <feature.icon className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 premium-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular items from the latest collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-brand-primary font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/catalog">
              <Button size="lg" variant="premium">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                La Valecia was born from a vision to create premium, futuristic apparel 
                that speaks to the modern generation. We believe in the power of design 
                to transform not just how you look, but how you feel.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our Drop Shoulder collection redefines comfort and style, while our 
                Wintery essentials keep you warm and fashionable through every season. 
                Every piece is crafted with attention to detail and a commitment to quality.
              </p>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden">
                <img
                  src="/images/products/drop-shoulder-2.jpg"
                  alt="La Valecia Story - Premium Quality"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter for the latest drops, exclusive offers, and style tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <Button size="lg" className="w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
