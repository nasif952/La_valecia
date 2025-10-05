import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for SSR
export const createClientComponentClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'
  )
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          postcode: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          postcode?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          postcode?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price_cents: number
          currency: string
          primary_color: string | null
          fit: string | null
          material: string | null
          care: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price_cents: number
          currency?: string
          primary_color?: string | null
          fit?: string | null
          material?: string | null
          care?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price_cents?: number
          currency?: string
          primary_color?: string | null
          fit?: string | null
          material?: string | null
          care?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_path: string
          sort: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_path: string
          sort: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_path?: string
          sort?: number
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          size: string
          color: string
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          size: string
          color: string
          stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          size?: string
          color?: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_cents: number
          currency: string
          status: 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'card' | 'bkash'
          bkash_txn_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_cents: number
          currency?: string
          status?: 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'card' | 'bkash'
          bkash_txn_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_cents?: number
          currency?: string
          status?: 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'card' | 'bkash'
          bkash_txn_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string
          qty: number
          unit_price_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id: string
          qty: number
          unit_price_cents: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string
          qty?: number
          unit_price_cents?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
