"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ordersAPI, Order } from "@/lib/api"
import { useAuth } from "./auth-context"

interface OrdersContextType {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  createOrder: (orderData: { 
    shippingAddress: string
    billingAddress?: string
    paymentMethod?: string
    paymentDetails?: any
  }) => Promise<{ success: boolean; message?: string; order?: Order }>
  completeOrder: (orderId: string) => Promise<{ success: boolean; message?: string }>
  getOrderById: (id: string) => Order | undefined
  getUserOrders: (userId: string) => Order[]
  cancelOrder: (id: string) => Promise<{ success: boolean; message?: string }>
  requestRefund: (id: string) => Promise<{ success: boolean; message?: string }>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Load orders when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [isAuthenticated])

  const fetchOrders = async (): Promise<void> => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await ordersAPI.getAll()

      if (response.success && response.data) {
        setOrders(response.data)
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

  const createOrder = async (orderData: { 
    shippingAddress: string
    billingAddress?: string
    paymentMethod?: string
    paymentDetails?: any
  }): Promise<{ success: boolean; message?: string; order?: Order }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لإنشاء طلب' }
    }

    try {
      setIsLoading(true)
      const response = await ordersAPI.create(orderData)

      if (response.success && response.data) {
        // Add new order to the list
        setOrders(prev => [response.data!, ...prev])
        return { success: true, order: response.data }
      } else {
        return { success: false, message: response.error || 'فشل إنشاء الطلب' }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false, message: 'حدث خطأ أثناء إنشاء الطلب' }
    } finally {
      setIsLoading(false)
    }
  }

  const completeOrder = async (orderId: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لإكمال الطلب' }
    }

    try {
      setIsLoading(true)
      // For now, we'll just update the order status locally
      // In a real implementation, you would call an API endpoint
      setOrders(prev => prev.map(order =>
        order._id === orderId 
          ? { ...order, status: 'completed' as const }
          : order
      ))
      return { success: true, message: 'تم إكمال الطلب بنجاح' }
    } catch (error) {
      console.error('Error completing order:', error)
      return { success: false, message: 'حدث خطأ أثناء إكمال الطلب' }
    } finally {
      setIsLoading(false)
    }
  }

  const getOrderById = (_id: string): Order | undefined => {
    return orders.find(order => order._id === _id)
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const cancelOrder = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لإلغاء الطلب' }
    }

    try {
      setIsLoading(true)
      const response = await ordersAPI.cancel(_id)

      if (response.success && response.data) {
        // Update order in the list
        setOrders(prev => prev.map(order =>
          order._id === _id ? response.data! : order
        ))
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل إلغاء الطلب' }
      }
    } catch (error) {
      console.error('Error canceling order:', error)
      return { success: false, message: 'حدث خطأ أثناء إلغاء الطلب' }
    } finally {
      setIsLoading(false)
    }
  }

  const requestRefund = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لطلب استرداد الأموال' }
    }

    try {
      setIsLoading(true)
      const response = await ordersAPI.requestRefund(_id)

      if (response.success) {
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل طلب استرداد الأموال' }
      }
    } catch (error) {
      console.error('Error requesting refund:', error)
      return { success: false, message: 'حدث خطأ أثناء طلب استرداد الأموال' }
    } finally {
      setIsLoading(false)
    }
  }

  const value: OrdersContextType = {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    completeOrder,
    getOrderById,
    getUserOrders,
    cancelOrder,
    requestRefund
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
} 