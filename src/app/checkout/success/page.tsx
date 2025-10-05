'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientComponentClient } from '@/lib/supabase'
import { OrderWithDetails } from '@/types'
import { formatPriceBDT, getOrderStatusText, getOrderStatusColor } from '@/lib/utils'
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

function CheckoutSuccessContent() {
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*),
            variant:product_variants(*)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return
      }

      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order not found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the order you're looking for.
            </p>
            <Link href="/catalog">
              <Button size="lg">
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-lg text-gray-500">
            Order ID: <span className="font-mono font-medium">{order.id}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusText(order.status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Ordered on {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={'/api/placeholder/100/100'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.variant.size} • Color: {item.variant.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.qty}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPriceBDT(item.unit_price_cents * item.qty)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {getOrderStatusText(order.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Method:</span> {order.payment_method.toUpperCase()}
                  </p>
                  {order.bkash_txn_id && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Transaction ID:</span> {order.bkash_txn_id}
                    </p>
                  )}
                </div>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatPriceBDT(order.total_cents)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPriceBDT(order.total_cents)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/profile/orders" className="block">
                    <Button variant="outline" className="w-full">
                      View Order History
                    </Button>
                  </Link>
                  <Link href="/catalog" className="block">
                    <Button className="w-full">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    We'll send you a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
