'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClientComponentClient } from '@/lib/supabase'
import { ProductWithDetails } from '@/types'
import { formatPriceBDT } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductDetailPage() {
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>([])
  
  const params = useParams()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', params.slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return
      }

      setProduct(data)
      
      // Set default selections
      if (data.variants.length > 0) {
        setSelectedSize(data.variants[0].size)
        setSelectedColor(data.variants[0].color)
      }

      // Fetch related products
      fetchRelatedProducts(data.name)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (productName: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .neq('slug', params.slug)
        .limit(4)

      if (error) {
        console.error('Error fetching related products:', error)
        return
      }

      setRelatedProducts(data || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const getAvailableSizes = () => {
    if (!product) return []
    const sizes = new Set(
      product.variants
        .filter(v => v.color === selectedColor)
        .map(v => v.size)
    )
    return Array.from(sizes)
  }

  const getAvailableColors = () => {
    if (!product) return []
    const colors = new Set(product.variants.map(v => v.color))
    return Array.from(colors)
  }

  const getSelectedVariant = () => {
    if (!product) return null
    return product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    )
  }

  const getStock = () => {
    const variant = getSelectedVariant()
    return variant?.stock || 0
  }

  const handleAddToCart = () => {
    const variant = getSelectedVariant()
    if (!variant) {
      toast({
        title: 'Please select size and color',
        description: 'Choose your preferred size and color before adding to cart.',
        variant: 'destructive',
      })
      return
    }

    if (getStock() < quantity) {
      toast({
        title: 'Insufficient stock',
        description: 'Not enough items in stock for your selection.',
        variant: 'destructive',
      })
      return
    }

    // TODO: Implement cart functionality
    toast({
      title: 'Added to cart!',
      description: `${product?.name} has been added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link href="/catalog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/catalog" className="text-brand-primary hover:text-brand-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Back to Catalog
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-white">
              <img
                src={product.images[selectedImageIndex]?.image_path || '/api/placeholder/600/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-brand-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.image_path}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-brand-primary">
                {formatPriceBDT(product.price_cents)}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              {product.fit && (
                <div>
                  <h4 className="font-medium text-gray-900">Fit</h4>
                  <p className="text-gray-600">{product.fit}</p>
                </div>
              )}
              {product.material && (
                <div>
                  <h4 className="font-medium text-gray-900">Material</h4>
                  <p className="text-gray-600">{product.material}</p>
                </div>
              )}
              {product.primary_color && (
                <div>
                  <h4 className="font-medium text-gray-900">Color</h4>
                  <p className="text-gray-600">{product.primary_color}</p>
                </div>
              )}
              {product.care && (
                <div>
                  <h4 className="font-medium text-gray-900">Care Instructions</h4>
                  <p className="text-gray-600">{product.care}</p>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes().map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-2xl transition-colors ${
                      selectedSize === size
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableColors().map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-2xl transition-colors ${
                      selectedColor === color
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-2xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(getStock(), quantity + 1))}
                    disabled={quantity >= getStock()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {getStock()} available
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                disabled={getStock() === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {getStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over ৳500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-brand-primary" />
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Link href={`/catalog/${relatedProduct.slug}`}>
                    <Card className="group hover-lift overflow-hidden">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={relatedProduct.images[0]?.image_path || '/api/placeholder/400/500'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPriceBDT(relatedProduct.price_cents)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
