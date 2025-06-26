"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  description: string
  shortDescription?: string
  longDescription?: string
  isNew?: boolean
  isFeatured?: boolean
  availability: "متوفر" | "نفد المخزون" | "قريباً"
  rating?: number
  reviewsCount?: number
  tags?: string[]
  details?: {
    platform?: string
    region?: string
    validity?: string
    type?: string
  }
  usageInstructions?: string[]
  options?: {
    label: string
    price: number
    sku: string
    availability: "متوفر" | "نفد المخزون"
  }[]
  defaultOptionSku?: string
  brandLogo?: string
  images?: string[]
  availableCodes?: number
  totalCodes?: number
  digitalCodes?: {
    id: string
    code: string
    status: "available" | "sold" | "used"
    soldDate?: string
    orderId?: string
  }[]
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getFeaturedProducts: () => Product[]
  getNewProducts: () => Product[]
  searchProducts: (query: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Local storage key
const PRODUCTS_STORAGE_KEY = "sadiqProducts"

// Helper functions for local storage
const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading products from localStorage:", error)
    return []
  }
}

const setStoredProducts = (products: Product[]) => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error("Error writing products to localStorage:", error)
  }
}

// Initialize with default products if none exist
const getInitialProducts = (): Product[] => {
  const stored = getStoredProducts()
  if (stored.length > 0) return stored

  // Return default products if no stored products exist
  return [
    {
      id: "prod_001",
      name: "بطاقة PlayStation Store بقيمة 20$",
      image: "/placeholder.svg?width=300&height=350",
      price: 75.0,
      category: "بطاقات الألعاب",
      description: "بطاقة شحن رصيد لمتجر بلايستيشن الأمريكي.",
      shortDescription: "بطاقة شحن رصيد لمتجر بلايستيشن الأمريكي بقيمة 20 دولار.",
      longDescription: "بطاقة شحن رصيد رسمية من سوني لمتجر بلايستيشن الأمريكي. يمكنك استخدامها لشراء الألعاب والإضافات والمحتوى الرقمي من متجر بلايستيشن.",
      isNew: true,
      isFeatured: true,
      availability: "متوفر",
      rating: 4.8,
      reviewsCount: 156,
      tags: ["PlayStation", "بطاقات ألعاب", "رصيد"],
      details: {
        platform: "PlayStation",
        region: "أمريكا",
        validity: "غير محدودة",
        type: "بطاقة رصيد"
      },
      usageInstructions: [
        "قم بتسجيل الدخول إلى حسابك في PlayStation Network",
        "اذهب إلى متجر PlayStation",
        "اختر إضافة رصيد إلى المحفظة",
        "أدخل رمز البطاقة",
        "استمتع بالمحتوى الرقمي!"
      ],
      availableCodes: 50,
      totalCodes: 100,
    },
    {
      id: "prod_002",
      name: "اشتراك Netflix Premium - شهر",
      image: "/placeholder.svg?width=300&height=350",
      price: 45.0,
      category: "اشتراكات الترفيه",
      description: "اشتراك لمدة شهر في خدمة نتفلكس بريميوم.",
      shortDescription: "اشتراك نتفلكس بريميوم لمدة شهر واحد.",
      longDescription: "اشتراك كامل في خدمة نتفلكس بريميوم لمدة شهر واحد. يشمل 4 شاشات في نفس الوقت، دقة 4K، ومحتوى حصري.",
      isNew: false,
      isFeatured: true,
      availability: "متوفر",
      rating: 4.6,
      reviewsCount: 89,
      tags: ["Netflix", "اشتراكات", "ترفيه"],
      details: {
        platform: "Netflix",
        region: "عالمي",
        validity: "شهر واحد",
        type: "اشتراك"
      },
      usageInstructions: [
        "اذهب إلى موقع Netflix.com",
        "اضغط على تسجيل الدخول",
        "اختر إضافة بطاقة هدايا",
        "أدخل رمز الاشتراك",
        "استمتع بالمحتوى!"
      ],
      availableCodes: 120,
      totalCodes: 200,
    },
    {
      id: "prod_003",
      name: "مفتاح تفعيل Windows 11 Pro",
      image: "/placeholder.svg?width=300&height=350",
      price: 150.0,
      category: "برامج وتطبيقات",
      description: "مفتاح تفعيل أصلي لنظام ويندوز 11 برو.",
      shortDescription: "مفتاح تفعيل رسمي من مايكروسوفت لنظام ويندوز 11 برو.",
      longDescription: "مفتاح تفعيل رسمي من مايكروسوفت لنظام ويندوز 11 برو. يتضمن جميع الميزات المتقدمة مثل Hyper-V، BitLocker، والمزيد.",
      isNew: true,
      isFeatured: false,
      availability: "متوفر",
      rating: 4.9,
      reviewsCount: 234,
      tags: ["Windows", "مايكروسوفت", "نظام تشغيل"],
      details: {
        platform: "Windows",
        region: "عالمي",
        validity: "مدى الحياة",
        type: "مفتاح تفعيل"
      },
      usageInstructions: [
        "قم بتثبيت Windows 11 على جهازك",
        "عند طلب مفتاح التفعيل، أدخل المفتاح المقدم",
        "اتبع التعليمات على الشاشة",
        "تم التفعيل بنجاح!"
      ],
      availableCodes: 15,
      totalCodes: 50,
    }
  ]
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Load products from localStorage on mount
  useEffect(() => {
    const initialProducts = getInitialProducts()
    setProducts(initialProducts)
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      setStoredProducts(products)
    }
  }, [products])

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const getProductById = (id: string) => {
    return products.find(product => product.id === id)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category)
  }

  const getFeaturedProducts = () => {
    return products.filter(product => product.isFeatured)
  }

  const getNewProducts = () => {
    return products.filter(product => product.isNew)
  }

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        getNewProducts,
        searchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
} 