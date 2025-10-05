import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatPriceBDT(cents: number): string {
  const amount = cents / 100
  return `৳${amount.toLocaleString('en-BD')}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSKU(category: string, productId: string, variant: string): string {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const variantCode = variant.substring(0, 2).toUpperCase()
  return `${categoryCode}-${productId.substring(0, 4)}-${variantCode}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getImageUrl(path: string): string {
  if (path.startsWith('http')) {
    return path
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'paid':
      return 'text-blue-600 bg-blue-100'
    case 'packed':
      return 'text-purple-600 bg-purple-100'
    case 'shipped':
      return 'text-indigo-600 bg-indigo-100'
    case 'delivered':
      return 'text-green-600 bg-green-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getOrderStatusText(status: string): string {
  switch (status) {
    case 'pending':
      return 'Payment Pending'
    case 'paid':
      return 'Payment Confirmed'
    case 'packed':
      return 'Order Packed'
    case 'shipped':
      return 'Shipped'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}
