'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPriceBDT, getOrderStatusText, getOrderStatusColor } from '@/lib/utils'
import { Package, ShoppingCart, Users, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  total_cents: number
  status: string
  created_at: string
  user_id: string
}

interface RecentProduct {
  id: string
  name: string
  price_cents: number
  is_active: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
  const [loading, setLoading] = useState(true)
  
  const { user } = useAuth()
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (user && !user.user_metadata?.admin) {
      router.push('/')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total_cents', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ])

      const totalProducts = productsResult.count || 0
      const totalOrders = ordersResult.count || 0
      const totalUsers = usersResult.count || 0
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + order.total_cents, 0) || 0

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      })

      // Fetch recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_cents, status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders(orders || [])

      // Fetch recent products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price_cents, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentProducts(products || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !user.user_metadata?.admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need admin privileges to access this page.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.email}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPriceBDT(stats.totalRevenue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Orders
                  <Link href="/admin/orders">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPriceBDT(order.total_cents)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Products
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(product.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{formatPriceBDT(product.price_cents)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/products/new">
                  <Button className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Manage Orders
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button variant="outline" className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Categories
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
