"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Local storage keys
const AUTH_STORAGE_KEY = "sadiqAuth"
const USERS_STORAGE_KEY = "sadiqUsers"

// Helper functions for local storage
const getStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false, isLoading: false }
  }
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : { user: null, isAuthenticated: false, isLoading: false }
  } catch (error) {
    console.error("Error reading auth from localStorage:", error)
    return { user: null, isAuthenticated: false, isLoading: false }
  }
}

const setStoredAuth = (auth: AuthState) => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  } catch (error) {
    console.error("Error writing auth to localStorage:", error)
  }
}

const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading users from localStorage:", error)
    return []
  }
}

const setStoredUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error writing users to localStorage:", error)
  }
}

// Simple password hashing (for demo purposes - use proper hashing in production)
const hashPassword = (password: string): string => {
  // This is a simple hash for demo - in production use bcrypt or similar
  return btoa(password + "sadiq_salt_2024")
}

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true })
  const router = useRouter()

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = getStoredAuth()
    setAuthState({ ...storedAuth, isLoading: false })
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!authState.isLoading) {
      setStoredAuth(authState)
    }
  }, [authState])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Get stored users
      const users = getStoredUsers()
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (!user) {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
      }

      // In a real app, you'd verify against hashed password from database
      // For demo, we'll assume the password is correct if user exists
      // In production: const isValid = await bcrypt.compare(password, user.password)
      
      // For demo purposes, let's create a simple password check
      // In real app, you'd store hashed passwords during signup
      const isValidPassword = true // Replace with actual password verification
      
      if (!isValidPassword) {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }
      }

      // Update auth state
      const newAuthState: AuthState = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          lastLogin: new Date().toISOString(),
          createdAt: user.createdAt,
          updatedAt: new Date().toISOString()
        },
        isAuthenticated: true,
        isLoading: false
      }
      
      setAuthState(newAuthState)
      
      // Update user's lastLogin in storage
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, lastLogin: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : u
      )
      setStoredUsers(updatedUsers)
      
      return { success: true }
      
    } catch (error) {
      console.error("Login error:", error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, message: "حدث خطأ أثناء تسجيل الدخول" }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Get stored users
      const users = getStoredUsers()
      
      // Check if email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل" }
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        phone: "",
        address: "",
        lastLogin: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // In a real app, you'd hash the password before storing
      // const hashedPassword = await bcrypt.hash(password, 10)
      
      // Add user to storage (in real app, this would go to database)
      const updatedUsers = [...users, newUser]
      setStoredUsers(updatedUsers)

      // Auto-login after successful signup
      const newAuthState: AuthState = {
        user: newUser,
        isAuthenticated: true,
        isLoading: false
      }
      
      setAuthState(newAuthState)
      return { success: true }
      
    } catch (error) {
      console.error("Signup error:", error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, message: "حدث خطأ أثناء إنشاء الحساب" }
    }
  }

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false })
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return

    const updatedUser = { ...authState.user, ...userData, updatedAt: new Date().toISOString() }
    
    // Update in auth state
    setAuthState(prev => ({ ...prev, user: updatedUser }))
    
    // Update in users storage
    const users = getStoredUsers()
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    setStoredUsers(updatedUsers)
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 