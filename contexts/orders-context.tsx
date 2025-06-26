"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { CartItem } from "@/contexts/cart-context"

export interface OrderItem extends CartItem {
  deliveredAt?: string
  code?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentMethod: string
  customerInfo: {
    email: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => Promise<Order>
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  completeOrder: (orderId: string) => void
  getUserOrders: (userId: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

// Local storage key
const ORDERS_STORAGE_KEY = "sadiqOrders"

// Helper functions for local storage
const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading orders from localStorage:", error)
    return []
  }
}

const setStoredOrders = (orders: Order[]) => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error("Error writing orders to localStorage:", error)
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = getStoredOrders()
    setOrders(storedOrders)
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    setStoredOrders(orders)
  }, [orders])

  const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setOrders(prevOrders => [...prevOrders, newOrder])
    return newOrder
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
          }
          
          // If order is completed, add completion timestamp
          if (status === "completed" && !order.completedAt) {
            updatedOrder.completedAt = new Date().toISOString()
          }
          
          return updatedOrder
        }
        return order
      })
    )
  }

  const completeOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Generate delivery codes for digital products
          const itemsWithCodes = order.items.map(item => ({
            ...item,
            code: generateDeliveryCode(),
            deliveredAt: new Date().toISOString(),
          }))
          
          return {
            ...order,
            items: itemsWithCodes,
            status: "completed" as const,
            updatedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
          }
        }
        return order
      })
    )
  }

  // Helper function to generate delivery codes
  const generateDeliveryCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-'
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        completeOrder,
        getUserOrders,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
} 