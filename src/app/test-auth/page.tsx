'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/providers'

export default function TestAuthPage() {
  const [supabaseTest, setSupabaseTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { user, profile } = useAuth()
  const supabase = createClientComponentClient()

  const testSupabaseConnection = async () => {
    setLoading(true)
    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setSupabaseTest({ success: false, error: error.message })
      } else {
        setSupabaseTest({ success: true, message: 'Supabase connection successful!' })
      }
    } catch (error) {
      setSupabaseTest({ success: false, error: 'Connection failed' })
    } finally {
      setLoading(false)
    }
  }

  const testProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('products').select('*').limit(5)
      
      if (error) {
        setSupabaseTest({ success: false, error: `Products error: ${error.message}` })
      } else {
        setSupabaseTest({ 
          success: true, 
          message: `Found ${data?.length || 0} products`,
          data: data
        })
      }
    } catch (error) {
      setSupabaseTest({ success: false, error: 'Products test failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth & Database Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}
              </div>
              {user && (
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
              )}
              {profile && (
                <div>
                  <strong>Name:</strong> {profile.name || 'Not set'}
                </div>
              )}
              <div>
                <strong>Profile ID:</strong> {profile?.id || 'No profile'}
              </div>
            </CardContent>
          </Card>

          {/* Supabase Test */}
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testSupabaseConnection} disabled={loading}>
                  Test Connection
                </Button>
                <Button onClick={testProducts} disabled={loading} variant="outline">
                  Test Products
                </Button>
              </div>
              
              {supabaseTest && (
                <div className={`p-4 rounded-lg ${
                  supabaseTest.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`font-medium ${
                    supabaseTest.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {supabaseTest.success ? '✅ Success' : '❌ Error'}
                  </div>
                  <div className={`text-sm ${
                    supabaseTest.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {supabaseTest.message || supabaseTest.error}
                  </div>
                  {supabaseTest.data && (
                    <div className="text-xs text-gray-600 mt-2">
                      <pre>{JSON.stringify(supabaseTest.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild>
                <a href="/auth/register">Register New User</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/login">Login</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/catalog">View Products</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin">Admin Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
