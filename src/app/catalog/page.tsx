'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createClientComponentClient } from '@/lib/supabase'
import { ProductWithDetails } from '@/types'
import { formatPriceBDT } from '@/lib/utils'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLOR_OPTIONS = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown']
const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'price-asc', label: 'Price Low to High' },
  { value: 'price-desc', label: 'Price High to Low' },
  { value: 'created_at-desc', label: 'Newest First' },
]

// Fallback static products (used when database is not available)
const fallbackProducts = [
  {
    id: '1',
    name: 'Drop Shoulder Hoodie - Classic',
    slug: 'drop-shoulder-hoodie-classic',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-1.jpg',
    category: 'Drop Shoulder',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
  },
  {
    id: '2',
    name: 'Drop Shoulder Hoodie - Premium',
    slug: 'drop-shoulder-hoodie-premium',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-2.jpg',
    category: 'Drop Shoulder',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Red'],
  },
  {
    id: '3',
    name: 'Drop Shoulder Hoodie - Modern',
    slug: 'drop-shoulder-hoodie-modern',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-3.jpg',
    category: 'Drop Shoulder',
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Gray', 'Blue'],
  },
  {
    id: '4',
    name: 'Drop Shoulder Hoodie - Elite',
    slug: 'drop-shoulder-hoodie-elite',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-4.jpg',
    category: 'Drop Shoulder',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Green', 'Purple'],
  },
  {
    id: '5',
    name: 'Drop Shoulder Hoodie - Signature',
    slug: 'drop-shoulder-hoodie-signature',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-5.jpg',
    category: 'Drop Shoulder',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Orange'],
  },
  {
    id: '6',
    name: 'Drop Shoulder Hoodie - Limited',
    slug: 'drop-shoulder-hoodie-limited',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-6.jpg',
    category: 'Drop Shoulder',
    sizes: ['M', 'L'],
    colors: ['Black', 'Red'],
  },
  {
    id: '7',
    name: 'Drop Shoulder Hoodie - Essential',
    slug: 'drop-shoulder-hoodie-essential',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-7.jpg',
    category: 'Drop Shoulder',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray', 'Navy'],
  },
  {
    id: '8',
    name: 'Drop Shoulder Hoodie - Pro',
    slug: 'drop-shoulder-hoodie-pro',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-8.jpg',
    category: 'Drop Shoulder',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Yellow'],
  },
  {
    id: '9',
    name: 'Drop Shoulder Hoodie - Ultimate',
    slug: 'drop-shoulder-hoodie-ultimate',
    price_cents: 399,
    currency: 'BDT',
    image: '/images/products/drop-shoulder-9.jpg',
    category: 'Drop Shoulder',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black', 'Pink'],
  },
]

function CatalogPageContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    size: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at-desc',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get filters from URL params
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    setFilters(prev => ({
      ...prev,
      search,
      category,
    }))
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Try to fetch from database first
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images(image_path, sort),
          product_variants(size, color, stock)
        `)
        .eq('is_active', true)

      // Apply category filter
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      // Apply search filter
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Apply price filters
      if (filters.minPrice) {
        query = query.gte('price_cents', parseInt(filters.minPrice))
      }
      if (filters.maxPrice) {
        query = query.lte('price_cents', parseInt(filters.maxPrice))
      }

      // Apply sorting
      const [sortField, sortOrder] = filters.sortBy.split('-')
      if (sortField === 'name') {
        query = query.order('name', { ascending: sortOrder === 'asc' })
      } else if (sortField === 'price') {
        query = query.order('price_cents', { ascending: sortOrder === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.warn('Database error, using fallback products:', error)
        // Use fallback products if database fails
        setProducts(fallbackProducts)
      } else if (data && data.length > 0) {
        // Transform database data to match our component structure
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price_cents: product.price_cents,
          currency: product.currency,
          image: product.product_images?.[0]?.image_path || '/api/placeholder/400/500',
          category: product.category_id, // You might want to join with categories table
          sizes: Array.from(new Set(product.product_variants?.map((v: any) => v.size) || [])),
          colors: Array.from(new Set(product.product_variants?.map((v: any) => v.color) || [])),
        }))
        setProducts(transformedProducts)
      } else {
        // No products found, use fallback
        setProducts(fallbackProducts)
      }
    } catch (error) {
      console.warn('Error fetching products, using fallback:', error)
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }


  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      size: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at-desc',
    })
  }

  const formatPriceBDT = (priceCents: number) => {
    return `৳${priceCents.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {filters.category ? `${filters.category} Collection` : 'All Products'}
          </h1>
          <p className="text-lg text-gray-600">
            Discover our premium collection of futuristic apparel
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-brand-primary"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="drop-shoulder">Drop Shoulder</option>
                    <option value="wintery">Wintery</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    {SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">All Colors</option>
                    {COLOR_OPTIONS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <p className="text-sm text-gray-600">
                  {products.length} products found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex border border-gray-300 rounded-2xl overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <p className="text-lg text-gray-600 mb-4">No products found</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/catalog/${product.slug}`}>
                      <Card className="group hover-lift overflow-hidden">
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPriceBDT(product.price_cents)}
                            </p>
                            <div className="flex items-center gap-1">
                              {product.sizes.slice(0, 3).map((size: string) => (
                                <span
                                  key={size}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {size}
                                </span>
                              ))}
                              {product.sizes.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{product.sizes.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CatalogPageContent />
    </Suspense>
  )
}
