import { Database } from '@/lib/supabase'

// Database types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

// Extended types with relations
export interface ProductWithDetails extends Product {
  images: ProductImage[]
  variants: ProductVariant[]
  category?: Category
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: Product
    variant: ProductVariant
  })[]
  profile?: Profile
}

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

// Form types
export interface ProfileFormData {
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  postcode: string
  country: string
}

export interface ProductFormData {
  name: string
  description: string
  price_cents: number
  currency: string
  primary_color: string
  fit: string
  material: string
  care: string
  is_active: boolean
  category_id: string
  variants: {
    size: string
    color: string
    stock: number
  }[]
  images: File[]
}

export interface CategoryFormData {
  name: string
  slug: string
}

// Filter types
export interface ProductFilters {
  category?: string
  size?: string
  color?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

// Payment types
export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

export interface BKashSession {
  paymentID: string
  status: string
  amount: number
  currency: string
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSettings {
  openaiApiKey?: string
  model?: string
  temperature?: number
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  description?: string
  disabled?: boolean
  external?: boolean
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[]
}

// Animation types
export interface AnimationVariants {
  hidden: {
    opacity: number
    y?: number
    x?: number
    scale?: number
  }
  visible: {
    opacity: number
    y?: number
    x?: number
    scale?: number
    transition?: {
      duration?: number
      delay?: number
      ease?: string
    }
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Size and color options
export const SIZE_OPTIONS = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'
] as const

export const COLOR_OPTIONS = [
  'Black', 'White', 'Gray', 'Navy', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown'
] as const

export type SizeOption = typeof SIZE_OPTIONS[number]
export type ColorOption = typeof COLOR_OPTIONS[number]

// Order status
export const ORDER_STATUSES = [
  'pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled'
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]

// Payment methods
export const PAYMENT_METHODS = [
  'card', 'bkash'
] as const

export type PaymentMethod = typeof PAYMENT_METHODS[number]
