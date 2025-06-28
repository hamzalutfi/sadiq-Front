"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { cartAPI, Cart, CartItem } from "@/lib/api"
import { useAuth } from "./auth-context"

interface CartContextType {
  cart: Cart | null
  cartItems: CartItem[]
  isLoading: boolean
  addToCart: (productId: string, quantity: number) => Promise<{ success: boolean; message?: string }>
  updateCartItem: (productId: string, quantity: number) => Promise<{ success: boolean; message?: string }>
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; message?: string }>
  removeFromCart: (productId: string) => Promise<{ success: boolean; message?: string }>
  clearCart: () => Promise<{ success: boolean; message?: string }>
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message?: string }>
  removeCoupon: () => Promise<{ success: boolean; message?: string }>
  refreshCart: () => Promise<void>
  getCartCount: () => number
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const response = await cartAPI.get()
      if (response.success && response.data) {
        setCart(response.data)
      } else {
        setCart(null)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لإضافة المنتجات إلى السلة' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.addItem({ productId, quantity })

      if (response.success && response.data) {
        setCart(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل إضافة المنتج إلى السلة' }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: 'حدث خطأ أثناء إضافة المنتج إلى السلة' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateCartItem = async (productId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لتحديث السلة' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.updateItem(productId, quantity)

      if (response.success && response.data) {
        setCart(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تحديث المنتج في السلة' }
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { success: false, message: 'حدث خطأ أثناء تحديث المنتج في السلة' }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لحذف المنتجات من السلة' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.removeItem(productId)

      if (response.success && response.data) {
        setCart(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل حذف المنتج من السلة' }
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, message: 'حدث خطأ أثناء حذف المنتج من السلة' }
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لتفريغ السلة' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.clear()

      if (response.success) {
        setCart(null)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تفريغ السلة' }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, message: 'حدث خطأ أثناء تفريغ السلة' }
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لتطبيق الكوبون' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.applyCoupon(couponCode)

      if (response.success && response.data) {
        setCart(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل تطبيق الكوبون' }
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      return { success: false, message: 'حدث خطأ أثناء تطبيق الكوبون' }
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'يجب تسجيل الدخول لإزالة الكوبون' }
    }

    try {
      setIsLoading(true)
      const response = await cartAPI.removeCoupon()

      if (response.success && response.data) {
        setCart(response.data)
        return { success: true }
      } else {
        return { success: false, message: response.error || 'فشل إزالة الكوبون' }
      }
    } catch (error) {
      console.error('Error removing coupon:', error)
      return { success: false, message: 'حدث خطأ أثناء إزالة الكوبون' }
    } finally {
      setIsLoading(false)
    }
  }

  const getCartCount = (): number => {
    if (!cart) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartTotal = (): number => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0)
  }

  const value: CartContextType = {
    cart,
    cartItems: cart?.items || [],
    isLoading,
    addToCart,
    updateCartItem,
    updateQuantity: updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart,
    getCartCount,
    getCartTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 