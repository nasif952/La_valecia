'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/providers'
import { createClientComponentClient } from '@/lib/supabase'
import { formatPriceBDT } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Smartphone, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price_cents: number
    images: { image_path: string }[]
  }
  variant: {
    id: string
    size: string
    color: string
  }
  quantity: number
}

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
  paymentMethod: 'card' | 'bkash'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
  bkashNumber: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'Bangladesh',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    bkashNumber: '',
  })
  
  const { user, profile } = useAuth()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Pre-fill form with user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: profile?.name?.split(' ')[0] || '',
        lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
        phone: profile?.phone || '',
        address: profile?.address_line1 || '',
        city: profile?.city || '',
        postcode: profile?.postcode || '',
      }))
    }

    setLoading(false)
  }, [user, profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price_cents * item.quantity), 0)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    return subtotal >= 50000 ? 0 : 2000 // Free shipping over ৳500
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  const validateForm = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'postcode']
    
    for (const field of requiredFields) {
      if (!formData[field as keyof CheckoutForm]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in the ${field} field`,
          variant: 'destructive',
        })
        return false
      }
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast({
          title: 'Missing Payment Information',
          description: 'Please fill in all card details',
          variant: 'destructive',
        })
        return false
      }
    } else if (formData.paymentMethod === 'bkash') {
      if (!formData.bkashNumber) {
        toast({
          title: 'Missing Payment Information',
          description: 'Please enter your bKash number',
          variant: 'destructive',
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setProcessing(true)

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_cents: getTotal(),
          currency: 'BDT',
          status: 'pending',
          payment_method: formData.paymentMethod,
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant.id,
        qty: item.quantity,
        unit_price_cents: item.product.price_cents,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw itemsError
      }

      // Process payment (dummy implementation)
      if (formData.paymentMethod === 'card') {
        await processCardPayment(order.id)
      } else {
        await processBKashPayment(order.id)
      }

      // Clear cart
      localStorage.removeItem('cart')
      
      // Redirect to success page
      router.push(`/checkout/success?order=${order.id}`)
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Checkout Failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const processCardPayment = async (orderId: string) => {
    // Mock card payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId)
  }

  const processBKashPayment = async (orderId: string) => {
    // Mock bKash payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update order status
    await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        bkash_txn_id: `BKASH_${Date.now()}`
      })
      .eq('id', orderId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/catalog">
              <Button size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
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
          <Link href="/cart" className="text-brand-primary hover:text-brand-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="postcode"
                      placeholder="Postal code"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Other">Other</option>
                  </select>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-brand-primary"
                      />
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === 'bkash'}
                        onChange={handleInputChange}
                        className="text-brand-primary"
                      />
                      <Smartphone className="h-5 w-5" />
                      <span>bKash</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <Input
                        name="cardNumber"
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="cardName"
                        placeholder="Name on card"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'bkash' && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <Input
                        name="bkashNumber"
                        placeholder="bKash number (01XXXXXXXXX)"
                        value={formData.bkashNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-sm text-gray-600">
                        You will be redirected to bKash to complete your payment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0]?.image_path || '/api/placeholder/50/50'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.variant.size} • {item.variant.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPriceBDT(item.product.price_cents * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPriceBDT(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {getShipping() === 0 ? 'Free' : formatPriceBDT(getShipping())}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPriceBDT(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={processing}
                  >
                    {processing ? (
                      'Processing...'
                    ) : (
                      <>
                        Place Order
                        <Check className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
