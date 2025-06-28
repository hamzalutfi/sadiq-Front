import { config } from './config'

// API Base URL
const API_BASE_URL = config.api.baseUrl

// Types
export interface User {
  _id: string
  fullName: string
  email: string
  phoneNumber?: string
  address?: string
  profileImage?: string
  preferences?: Record<string, any>
  role: 'user' | 'admin'
  isEmailVerified: boolean
  isSuspended?: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  name: string
  price: number
  category: string
  description: string
  productType: 'physical' | 'digital'
  images?: Array<{
    url: string
    alt?: string
    isPrimary?: boolean
  }>
  image?: File | string
  stock?: number
  rating?: number
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  _id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  _id: string
  productId?: string
  product: Product | string
  quantity: number
  price: number
  name?: string
  image?: string
  optionLabel?: string
  platform?: string
  appliedOffer?: string
  discountAmount?: number
}

export interface Cart {
  _id: string
  userId: string
  user?: User
  items: Array<{
    _id: string
    product: Product | string
    quantity: number
    price: number
    appliedOffer?: string
    discountAmount: number
  }>
  couponCode?: string
  couponDiscount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  orderNumber: string
  userId: string
  user?: User
  items: Array<{
    _id: string
    product: Product | string
    name: string
    price: number
    quantity: number
    digitalContent?: {
      licenseKey?: string
      downloadUrl?: string
      activationInstructions?: string
    }
  }>
  shippingAddress: {
    fullName?: string
    phoneNumber?: string
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  } | string
  billingAddress: {
    fullName?: string
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  } | string
  paymentMethod: string
  paymentDetails?: {
    transactionId?: string
    paymentIntentId?: string
    status?: string
    paidAt?: Date
  }
  pricing: {
    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number
  }
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  statusHistory?: Array<{
    status: string
    date: Date
    note?: string
    updatedBy?: string
  }>
  notes?: {
    customer?: string
    admin?: string
  }
  tracking?: {
    carrier?: string
    trackingNumber?: string
    estimatedDelivery?: Date
    deliveredAt?: Date
  }
  metadata?: {
    ipAddress?: string
    userAgent?: string
    source?: string
    couponCode?: string
  }
  refund?: {
    requested: boolean
    requestedAt?: Date
    reason?: string
    amount?: number
    processedAt?: Date
    processedBy?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Offer {
  _id: string
  title: string
  description?: string
  discount: number
  isActive: boolean
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface Analytics {
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
  }
  products: {
    total: number
    active: number
    lowStock: number
  }
  customers: {
    total: number
    new: number
    active: number
  }
  conversion: {
    rate: number
    orders: number
    averageOrderValue: number
  }
}

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface AuthResponse {
  user: User
  token: string
}

// Helper function to handle API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    const fetchConfig: RequestInit = {
      headers: {},
      ...options,
    }

    // Only set Content-Type if it's not FormData and not already set
    const hasContentType = options.headers &&
      (typeof options.headers === 'object' && 'Content-Type' in options.headers) ||
      (Array.isArray(options.headers) && options.headers.some(h => h[0] === 'Content-Type'))

    if (!(options.body instanceof FormData) && !hasContentType) {
      fetchConfig.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    } else if (options.headers) {
      fetchConfig.headers = {
        ...fetchConfig.headers,
        ...options.headers,
      }
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        fetchConfig.headers = {
          ...fetchConfig.headers,
          'Authorization': `Bearer ${token}`,
        }
      }
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Something went wrong',
      }
    }

    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    console.error('API call error:', error)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
        }
      }
    }

    return {
      success: false,
      error: 'Network error occurred',
    }
  }
}

// Auth API
export const authAPI = {
  // Register
  register: async (userData: {
    fullName: string
    email: string
    password: string
    phoneNumber: string
  }): Promise<ApiResponse<AuthResponse>> => {
    return apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // Login
  login: async (credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<AuthResponse>> => {
    return apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return apiCall<void>('/auth/logout', {
      method: 'POST',
    })
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>('/auth/me')
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/auth/verify-email/${token}`)
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiCall<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    })
  },

  // Update password
  updatePassword: async (passwords: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse<void>> => {
    return apiCall<void>('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    })
  },
}

// Users API
export const usersAPI = {
  // Get profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiCall<User>('/users/profile')
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiCall<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  // Update email
  updateEmail: async (data: {
    newEmail: string
    password: string
  }): Promise<ApiResponse<void>> => {
    return apiCall<void>('/users/email', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete account
  deleteAccount: async (password: string): Promise<ApiResponse<void>> => {
    return apiCall<void>('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    })
  },

  // Upload profile image
  uploadProfileImage: async (image: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData()
    formData.append('image', image)

    return apiCall<{ imageUrl: string }>('/users/profile-image', {
      method: 'PUT',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  },
}

// Products API
export const productsAPI = {
  // Get all products
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return apiCall<Product[]>('/products')
  },

  // Create product
  create: async (productData: {
    name: string
    price: number
    category: string
    description: string
    productType: 'physical' | 'digital'
    image?: File
  }): Promise<ApiResponse<Product>> => {
    const formData = new FormData()
    formData.append('name', productData.name)
    formData.append('price', productData.price.toString())
    formData.append('category', productData.category)
    formData.append('description', productData.description)
    formData.append('productType', productData.productType)

    if (productData.image) {
      formData.append('images', productData.image)
    }

    return apiCall<Product>('/products', {
      method: 'POST',
      body: formData,
    })
  },

  // Get product by ID
  getById: async (_id: string): Promise<ApiResponse<Product>> => {
    return apiCall<Product>(`/products/${_id}`)
  },

  // Update product
  update: async (_id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    return apiCall<Product>(`/products/${_id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  // Delete product
  delete: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/products/${_id}`, {
      method: 'DELETE',
    })
  },

  // Get products by category
  getByCategory: async (categorySlug: string): Promise<ApiResponse<Product[]>> => {
    return apiCall<Product[]>(`/products/category/${categorySlug}`)
  },

  // Add review
  addReview: async (productId: string, review: {
    rating: number
    comment: string
  }): Promise<ApiResponse<Review>> => {
    return apiCall<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    })
  },
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return apiCall<Category[]>('/categories')
  },

  // Create category
  create: async (categoryData: {
    name: string
    slug: string
  }): Promise<ApiResponse<Category>> => {
    return apiCall<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  // Get category by ID
  getById: async (_id: string): Promise<ApiResponse<Category>> => {
    return apiCall<Category>(`/categories/${_id}`)
  },

  // Update category
  update: async (_id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> => {
    return apiCall<Category>(`/categories/${_id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  // Delete category
  delete: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/categories/${_id}`, {
      method: 'DELETE',
    })
  },
}

// Cart API
export const cartAPI = {
  // Get cart
  get: async (): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>('/cart')
  },

  // Clear cart
  clear: async (): Promise<ApiResponse<void>> => {
    return apiCall<void>('/cart', {
      method: 'DELETE',
    })
  },

  // Add to cart
  addItem: async (item: {
    productId: string
    quantity: number
  }): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    })
  },

  // Update cart item
  updateItem: async (productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  // Remove from cart
  removeItem: async (productId: string): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>(`/cart/items/${productId}`, {
      method: 'DELETE',
    })
  },

  // Apply coupon
  applyCoupon: async (couponCode: string): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    })
  },

  // Remove coupon
  removeCoupon: async (): Promise<ApiResponse<Cart>> => {
    return apiCall<Cart>('/cart/coupon', {
      method: 'DELETE',
    })
  },
}

// Orders API
export const ordersAPI = {
  // Get orders
  getAll: async (): Promise<ApiResponse<Order[]>> => {
    return apiCall<Order[]>('/orders')
  },

  // Create order
  create: async (orderData: {
    shippingAddress: string
    billingAddress?: string
    paymentMethod?: string
    paymentDetails?: any
  }): Promise<ApiResponse<Order>> => {
    return apiCall<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  // Get order by ID
  getById: async (_id: string): Promise<ApiResponse<Order>> => {
    return apiCall<Order>(`/orders/${_id}`)
  },

  // Cancel order
  cancel: async (_id: string): Promise<ApiResponse<Order>> => {
    return apiCall<Order>(`/orders/${_id}/cancel`, {
      method: 'PUT',
    })
  },

  // Request refund
  requestRefund: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/orders/${_id}/refund`, {
      method: 'POST',
    })
  },
}

// Offers API
export const offersAPI = {
  // Get active offers
  getActive: async (): Promise<ApiResponse<Offer[]>> => {
    return apiCall<Offer[]>('/offers/active')
  },

  // Get all offers
  getAll: async (): Promise<ApiResponse<Offer[]>> => {
    return apiCall<Offer[]>('/offers')
  },

  // Create offer
  create: async (offerData: {
    title: string
    discount: number
  }): Promise<ApiResponse<Offer>> => {
    return apiCall<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    })
  },

  // Get offer by ID
  getById: async (_id: string): Promise<ApiResponse<Offer>> => {
    return apiCall<Offer>(`/offers/${_id}`)
  },

  // Update offer
  update: async (_id: string, offerData: Partial<Offer>): Promise<ApiResponse<Offer>> => {
    return apiCall<Offer>(`/offers/${_id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    })
  },

  // Delete offer
  delete: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/offers/${_id}`, {
      method: 'DELETE',
    })
  },
}

// Analytics API
export const analyticsAPI = {
  // Revenue analytics
  getRevenue: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/analytics/revenue')
  },

  // Product analytics
  getProducts: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/analytics/products')
  },

  // Customer analytics
  getCustomers: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/analytics/customers')
  },

  // Conversion analytics
  getConversion: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/analytics/conversion')
  },
}

// Admin API
export const adminAPI = {
  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiCall<User[]>('/admin/users')
  },

  // Add user
  addUser: async (userData: {
    fullName: string
    email: string
    password: string
    phoneNumber?: string
    role?: 'user' | 'admin'
  }): Promise<ApiResponse<User>> => {
    return apiCall<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // Update user
  updateUser: async (_id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/admin/users/${_id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  // Delete user
  deleteUser: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/admin/users/${_id}`, {
      method: 'DELETE',
    })
  },

  // Suspend user
  suspendUser: async (_id: string): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/admin/users/${_id}/suspend`, {
      method: 'PUT',
    })
  },

  // Activate user
  activateUser: async (_id: string): Promise<ApiResponse<User>> => {
    return apiCall<User>(`/admin/users/${_id}/activate`, {
      method: 'PUT',
    })
  },

  // Get all orders
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiCall<Order[]>('/admin/orders')
  },

  // Update order status
  updateOrderStatus: async (_id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return apiCall<Order>(`/admin/orders/${_id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  // Process refund
  processRefund: async (_id: string): Promise<ApiResponse<void>> => {
    return apiCall<void>(`/admin/orders/${_id}/refund`, {
      method: 'POST',
    })
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/admin/dashboard')
  },

  // Sales report
  getSalesReport: async (): Promise<ApiResponse<any>> => {
    return apiCall<any>('/admin/reports/sales')
  },
}

// Token management
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken()
  },
} 