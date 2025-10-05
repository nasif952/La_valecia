'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/providers'
import { formatPriceBDT } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price_cents: number
    images: { image_path: string }[]
  }
  variant: {
    id: string
    size: string
    color: string
    stock: number
  }
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // For now, we'll use localStorage for cart
    // In a real app, this would be stored in the database
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        if (newQuantity > item.variant.stock) {
          toast({
            title: 'Insufficient stock',
            description: `Only ${item.variant.stock} items available`,
            variant: 'destructive',
          })
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    updateCart(updatedCart)
  }

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    updateCart(updatedCart)
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your cart',
    })
  }

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === 'welcome10') {
      setDiscount(0.1)
      toast({
        title: 'Coupon applied!',
        description: '10% discount applied to your order',
      })
    } else {
      toast({
        title: 'Invalid coupon',
        description: 'The coupon code you entered is not valid',
        variant: 'destructive',
      })
    }
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price_cents * item.quantity), 0)
  }

  const getDiscountAmount = () => {
    return Math.round(getSubtotal() * discount)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    return subtotal >= 50000 ? 0 : 2000 // Free shipping over ৳500
  }

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShipping()
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to proceed with checkout',
        variant: 'destructive',
      })
      router.push('/auth/login')
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout',
        variant: 'destructive',
      })
      return
    }

    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/catalog">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]?.image_path || '/api/placeholder/100/100'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/catalog/${item.product.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.variant.size} • Color: {item.variant.color}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {formatPriceBDT(item.product.price_cents)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPriceBDT(getSubtotal())}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatPriceBDT(getDiscountAmount())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {getShipping() === 0 ? 'Free' : formatPriceBDT(getShipping())}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPriceBDT(getTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                {/* Continue Shopping */}
                <Link href="/catalog" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
