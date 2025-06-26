"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useOrders } from "@/contexts/orders-context"
import { Order } from "@/contexts/orders-context"

export interface AdminUser {
  id: string
  name: string
  email: string
  createdAt: string
  totalOrders: number
  status: "active" | "suspended"
  lastLogin?: string
}

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  averageOrderValue: number
  monthlyRevenue: number
  monthlyOrders: number
  monthlyUsers: number
}

interface AdminContextType {
  // Admin authentication
  isAdmin: boolean
  adminUser: AdminUser | null
  
  // Statistics
  getStats: () => AdminStats
  getMonthlyStats: () => { month: string; revenue: number; orders: number }[]
  
  // Order management
  getAllOrders: () => Order[]
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  deleteOrder: (orderId: string) => void
  
  // User management
  getAllUsers: () => AdminUser[]
  addUser: (userData: Omit<AdminUser, "id" | "createdAt" | "totalOrders">) => void
  updateUser: (userId: string, updates: Partial<AdminUser>) => void
  deleteUser: (userId: string) => void
  suspendUser: (userId: string) => void
  activateUser: (userId: string) => void
  
  // Product analytics
  getTopProducts: () => { name: string; sales: number; revenue: number }[]
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Local storage keys
const ADMIN_USERS_STORAGE_KEY = "sadiqAdminUsers"

// Helper functions for local storage
const getStoredAdminUsers = (): AdminUser[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(ADMIN_USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading admin users from localStorage:", error)
    return []
  }
}

const setStoredAdminUsers = (users: AdminUser[]) => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error writing admin users to localStorage:", error)
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { orders, updateOrderStatus: updateOrderStatusInContext } = useOrders()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  // Load admin users from localStorage on mount
  useEffect(() => {
    const storedUsers = getStoredAdminUsers()
    setAdminUsers(storedUsers)
  }, [])

  // Save admin users to localStorage whenever they change
  useEffect(() => {
    setStoredAdminUsers(adminUsers)
  }, [adminUsers])

  // Sync with auth users from localStorage
  useEffect(() => {
    const getStoredUsers = (): any[] => {
      if (typeof window === "undefined") return []
      
      try {
        const stored = localStorage.getItem("sadiqUsers")
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error("Error reading users from localStorage:", error)
        return []
      }
    }

    const users = getStoredUsers()
    if (users && users.length > 0) {
      const authUsersAsAdmin: AdminUser[] = users.map((authUser: any) => ({
        id: authUser.id,
        name: authUser.name || "مستخدم",
        email: authUser.email,
        createdAt: authUser.createdAt || new Date().toISOString(),
        totalOrders: orders ? orders.filter(order => order.userId === authUser.id).length : 0,
        status: "active" as const,
        lastLogin: authUser.lastLogin,
      }))
      
      setAdminUsers(prev => {
        // Merge with existing admin users, avoiding duplicates
        const existingIds = new Set(prev.map(u => u.id))
        const newUsers = authUsersAsAdmin.filter(u => !existingIds.has(u.id))
        
        if (newUsers.length > 0) {
          return [...prev, ...newUsers]
        }
        return prev
      })
    }
  }, [orders])

  // Check if current user is admin (for demo, any authenticated user can be admin)
  // Temporarily making this more permissive for testing
  // const isAdmin = isAuthenticated && user !== null
  
  // For testing: allow admin access even without full auth
  const isAdmin = true // Uncomment this line for testing without login
  
  // Debug logging
  console.log("Admin Context Debug:", {
    isAuthenticated,
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    isAdmin,
    adminUsersCount: adminUsers.length
  })
  
  const adminUser: AdminUser | null = user ? {
    id: user.id,
    name: user.name || "Admin",
    email: user.email,
    createdAt: user.createdAt || new Date().toISOString(),
    totalOrders: orders ? orders.filter(order => order.userId === user.id).length : 0,
    status: "active",
  } : null

  const getStats = (): AdminStats => {
    const totalRevenue = orders ? orders.reduce((sum, order) => sum + order.total, 0) : 0
    const totalOrders = orders ? orders.length : 0
    const totalUsers = adminUsers.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate monthly stats
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthlyOrders = orders ? orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    }) : []
    
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0)
    const monthlyUsers = adminUsers.filter(user => {
      const userDate = new Date(user.createdAt)
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear
    }).length

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      averageOrderValue,
      monthlyRevenue,
      monthlyOrders: monthlyOrders.length,
      monthlyUsers,
    }
  }

  const getMonthlyStats = () => {
    const months = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthOrders = orders ? orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
      }) : []
      
      months.push({
        month: date.toLocaleDateString('ar-SA', { month: 'short' }),
        revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
        orders: monthOrders.length,
      })
    }
    
    return months
  }

  const getAllOrders = () => {
    return orders ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : []
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    updateOrderStatusInContext(orderId, status)
  }

  const deleteOrder = (orderId: string) => {
    // In a real app, this would call an API
    // For now, we'll just log it
    console.log("Deleting order:", orderId)
  }

  const getAllUsers = () => {
    // Update total orders for each user
    const usersWithUpdatedOrders = adminUsers.map(user => ({
      ...user,
      totalOrders: orders ? orders.filter(order => order.userId === user.id).length : 0,
    }))
    
    return usersWithUpdatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const addUser = (userData: Omit<AdminUser, "id" | "createdAt" | "totalOrders">) => {
    const newUser: AdminUser = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
    }
    setAdminUsers(prev => [...prev, newUser])
  }

  const updateUser = (userId: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
  }

  const deleteUser = (userId: string) => {
    setAdminUsers(prev => prev.filter(user => user.id !== userId))
  }

  const suspendUser = (userId: string) => {
    updateUser(userId, { status: "suspended" })
  }

  const activateUser = (userId: string) => {
    updateUser(userId, { status: "active" })
  }

  const getTopProducts = () => {
    // Count product sales from orders
    const productSales: { [key: string]: { sales: number; revenue: number } } = {}
    
    if (orders) {
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = { sales: 0, revenue: 0 }
          }
          productSales[item.name].sales += item.quantity
          productSales[item.name].revenue += item.price * item.quantity
        })
      })
    }
    
    return Object.entries(productSales)
      .map(([name, data]) => ({ name, sales: data.sales, revenue: data.revenue }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminUser,
        getStats,
        getMonthlyStats,
        getAllOrders,
        updateOrderStatus,
        deleteOrder,
        getAllUsers,
        addUser,
        updateUser,
        deleteUser,
        suspendUser,
        activateUser,
        getTopProducts,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
} 