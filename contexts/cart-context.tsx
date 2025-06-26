"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { StoreProduct } from "@/lib/mock-products"

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  optionLabel?: string
  platform?: string
  category?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: StoreProduct, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sadiqCart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sadiqCart", JSON.stringify(cartItems))
    
    // Update cart count for header
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    localStorage.setItem("sadiqCartCount", totalQuantity.toString())
    window.dispatchEvent(new Event("storage"))
  }, [cartItems])

  const addToCart = (product: StoreProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // If item doesn't exist, add new item
        const newCartItem: CartItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
          platform: product.platform,
          category: product.category,
        }
        return [...prevItems, newCartItem]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 