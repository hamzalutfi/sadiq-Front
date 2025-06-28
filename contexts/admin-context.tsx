"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { adminAPI, analyticsAPI, User, Order } from "@/lib/api"
import { useAuth } from "./auth-context"

interface AdminContextType {
  users: User[]
  allOrders: Order[]
  dashboardStats: any
  analytics: any
  isLoading: boolean
  error: string | null
  isAdmin: boolean
  fetchUsers: () => Promise<void>
  fetchAllOrders: () => Promise<void>
  fetchDashboardStats: () => Promise<void>
  fetchAnalytics: () => Promise<void>
  getAllUsers: () => User[]
  addUser: (userData: { fullName: string; email: string; password: string; phoneNumber?: string; role?: 'user' | 'admin' }) => Promise<{ success: boolean; message?: string; user?: User }>
  updateUser: (id: string, userData: Partial<User>) => Promise<{ success: boolean; message?: string }>
  deleteUser: (id: string) => Promise<{ success: boolean; message?: string }>
  suspendUser: (id: string) => Promise<{ success: boolean; message?: string }>
  activateUser: (id: string) => Promise<{ success: boolean; message?: string }>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<{ success: boolean; message?: string }>
  processRefund: (id: string) => Promise<{ success: boolean; message?: string }>
  getSalesReport: () => Promise<{ success: boolean; data?: any; message?: string }>
  getStats: () => any
  getMonthlyStats: () => any
  getAllOrders: () => Order[]
  getTopProducts: () => any[]
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  // Load admin data when user is authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardStats()
      fetchAnalytics()
      fetchAllOrders()
      fetchUsers()
    } else {
      setUsers([])
      setAllOrders([])
      setDashboardStats(null)
      setAnalytics(null)
    }
  }, [isAuthenticated, isAdmin])

  const fetchUsers = async (): Promise<void> => {
    if (!isAuthenticated || !isAdmin) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await adminAPI.getAllUsers()
      console.log('response', response)

      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.error || 'فشل تحميل المستخدمين')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('حدث خطأ أثناء تحميل المستخدمين')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllOrders = async (): Promise<void> => {
    if (!isAuthenticated || !isAdmin) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await adminAPI.getAllOrders()
      if (response.success && response.data) {
        setAllOrders(response.data)
      } else {
        setError(response.error || 'فشل تحميل الطلبات')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('حدث خطأ أثناء تحميل الطلبات')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardStats = async (): Promise<void> => {
    if (!isAuthenticated || !isAdmin) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await adminAPI.getDashboardStats()

      if (response.success && response.data) {
        setDashboardStats(response.data)
      } else {
        setError(response.error || 'فشل تحميل إحصائيات لوحة التحكم')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('حدث خطأ أثناء تحميل إحصائيات لوحة التحكم')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async (): Promise<void> => {
    if (!isAuthenticated || !isAdmin) return

    try {
      setIsLoading(true)
      setError(null)

      const [revenueRes, productsRes, customersRes, conversionRes] = await Promise.all([
        analyticsAPI.getRevenue(),
        analyticsAPI.getProducts(),
        analyticsAPI.getCustomers(),
        analyticsAPI.getConversion()
      ])

      const analyticsData = {
        revenue: revenueRes.success ? revenueRes.data : null,
        products: productsRes.success ? productsRes.data : null,
        customers: customersRes.success ? customersRes.data : null,
        conversion: conversionRes.success ? conversionRes.data : null
      }

      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('حدث خطأ أثناء تحميل التحليلات')
    } finally {
      setIsLoading(false)
    }
  }

  const getAllUsers = (): User[] => {
    return users
  }

  const addUser = async (userData: { fullName: string; email: string; password: string; phoneNumber?: string; role?: 'user' | 'admin' }): Promise<{ success: boolean; message?: string; user?: User }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بإضافة مستخدم' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.addUser(userData)

      if (response.success && response.data) {
        setUsers(prev => [...prev, response.data!])
        return { success: true, user: response.data }
      } else {
        return { success: false, message: response.error || 'فشل إضافة المستخدم' }
      }
    } catch (error) {
      console.error('Error adding user:', error)
      return { success: false, message: 'حدث خطأ أثناء إضافة المستخدم' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (_id: string, userData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بتحديث المستخدمين' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.updateUser(_id, userData)

      if (response.success && response.data) {
        // Update user in the list
        setUsers(prev => prev.map(user =>
          user._id === _id ? response.data! : user
        ))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تحديث المستخدم' }
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, message: 'حدث خطأ أثناء تحديث المستخدم' }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بحذف المستخدم' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.deleteUser(_id)

      if (response.success) {
        setUsers(prev => prev.filter(user => user._id !== _id))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل حذف المستخدم' }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { success: false, message: 'حدث خطأ أثناء حذف المستخدم' }
    } finally {
      setIsLoading(false)
    }
  }

  const suspendUser = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بتعليق المستخدم' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.suspendUser(_id)

      if (response.success) {
        setUsers(prev => prev.map(user =>
          user._id === _id ? { ...user, isSuspended: true, isActive: false } : user
        ))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تعليق المستخدم' }
      }
    } catch (error) {
      console.error('Error suspending user:', error)
      return { success: false, message: 'حدث خطأ أثناء تعليق المستخدم' }
    } finally {
      setIsLoading(false)
    }
  }

  const activateUser = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بتفعيل المستخدم' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.activateUser(_id)

      if (response.success) {
        setUsers(prev => prev.map(user =>
          user._id === _id ? { ...user, isSuspended: false, isActive: true } : user
        ))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تفعيل المستخدم' }
      }
    } catch (error) {
      console.error('Error activating user:', error)
      return { success: false, message: 'حدث خطأ أثناء تفعيل المستخدم' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (_id: string, status: Order['status']): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بتحديث حالة الطلبات' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.updateOrderStatus(_id, status)

      if (response.success && response.data) {
        // Update order in the list
        setAllOrders(prev => prev.map(order =>
          order._id === _id ? response.data! : order
        ))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تحديث حالة الطلب' }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, message: 'حدث خطأ أثناء تحديث حالة الطلب' }
    } finally {
      setIsLoading(false)
    }
  }

  const processRefund = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بمعالجة الاسترداد' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.processRefund(_id)

      if (response.success) {
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل معالجة الاسترداد' }
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      return { success: false, message: 'حدث خطأ أثناء معالجة الاسترداد' }
    } finally {
      setIsLoading(false)
    }
  }

  const getSalesReport = async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    if (!isAuthenticated || !isAdmin) {
      return { success: false, message: 'غير مصرح لك بالوصول إلى تقارير المبيعات' }
    }

    try {
      setIsLoading(true)
      const response = await adminAPI.getSalesReport()

      if (response.success && response.data) {
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.error || 'فشل تحميل تقرير المبيعات' }
      }
    } catch (error) {
      console.error('Error fetching sales report:', error)
      return { success: false, message: 'حدث خطأ أثناء تحميل تقرير المبيعات' }
    } finally {
      setIsLoading(false)
    }
  }

  const getStats = () => {
    if (!dashboardStats) return null
    return {
      totalRevenue: dashboardStats.totalRevenue || 0,
      totalOrders: dashboardStats.totalOrders || 0,
      totalUsers: dashboardStats.totalUsers || 0,
      totalProducts: dashboardStats.totalProducts || 0
    }
  }

  const getMonthlyStats = () => {
    if (!analytics?.revenue) return []

    // Generate monthly data for the last 12 months
    const monthlyData = []
    const currentDate = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('ar-SA', { month: 'short' })

      monthlyData.push({
        month: monthName,
        revenue: analytics.revenue.monthly || 0,
        orders: analytics.revenue.monthlyOrders || 0
      })
    }

    return monthlyData
  }

  const getAllOrders = (): Order[] => {
    return allOrders
  }

  const getTopProducts = (): any[] => {
    if (!analytics?.products) return []

    // Extract top products from analytics or calculate from orders
    const productSales = new Map<string, { product: any; quantity: number; revenue: number }>()

    allOrders.forEach(order => {
      order.items.forEach(item => {
        const productId = typeof item.product === 'string' ? item.product : item.product._id
        const existing = productSales.get(productId)

        if (existing) {
          existing.quantity += item.quantity
          existing.revenue += item.quantity * item.price
        } else {
          productSales.set(productId, {
            product: typeof item.product === 'string' ? { _id: productId, name: item.name } : item.product,
            quantity: item.quantity,
            revenue: item.quantity * item.price
          })
        }
      })
    })

    // Sort by revenue and return top 10
    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  const value: AdminContextType = {
    users,
    allOrders,
    dashboardStats,
    analytics,
    isLoading,
    error,
    isAdmin,
    fetchUsers,
    fetchAllOrders,
    fetchDashboardStats,
    fetchAnalytics,
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    updateOrderStatus,
    processRefund,
    getSalesReport,
    getStats,
    getMonthlyStats,
    getAllOrders,
    getTopProducts
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
} 