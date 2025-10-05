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
import { Profile, OrderWithDetails } from '@/types'
import { formatPriceBDT, getOrderStatusText, getOrderStatusColor } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { User, Package, MapPin, Phone, Mail, Edit, Save, X, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    country: 'Bangladesh',
  })
  
  const { user, signOut } = useAuth()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchProfile()
    fetchOrders()
  }, [user, router])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        city: data.city || '',
        postcode: data.postcode || '',
        country: data.country || 'Bangladesh',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id)

      if (error) {
        throw error
      }

      setProfile(prev => prev ? { ...prev, ...formData } : null)
      setEditing(false)
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Update failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address_line1: profile?.address_line1 || '',
      address_line2: profile?.address_line2 || '',
      city: profile?.city || '',
      postcode: profile?.postcode || '',
      country: profile?.country || 'Bangladesh',
    })
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 h-64 bg-gray-200 rounded" />
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
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
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your orders</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                      <Input
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address Line 2</label>
                      <Input
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Postcode</label>
                        <Input
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </div>
                      {profile?.name && (
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{profile.name}</span>
                        </div>
                      )}
                      {profile?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{profile.phone}</span>
                        </div>
                      )}
                      {profile?.address_line1 && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <div>{profile.address_line1}</div>
                            {profile.address_line2 && <div>{profile.address_line2}</div>}
                            <div>{profile.city}, {profile.postcode}</div>
                            <div>{profile.country}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button onClick={() => setEditing(true)} variant="outline" className="w-full mt-4">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start shopping to see your orders here.</p>
                    <Link href="/catalog">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPriceBDT(order.total_cents)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={'/api/placeholder/50/50'}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-gray-600">
                                  Size: {item.variant.size} • Color: {item.variant.color} • Qty: {item.qty}
                                </p>
                              </div>
                              <p className="font-medium text-gray-900">
                                {formatPriceBDT(item.unit_price_cents * item.qty)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
