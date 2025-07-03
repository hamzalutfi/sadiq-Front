"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { productsAPI, Product, Category } from "@/lib/api"

interface ProductsContextType {
  products: Product[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  fetchProductsByCategory: (categorySlug: string) => Promise<void>
  fetchCategories: () => Promise<void>
  getProductById: (id: string) => Product | undefined
  getCategoryById: (id: string) => Category | undefined
  getCategoryBySlug: (slug: string) => Category | undefined
  addProduct: (productData: {
    name: string
    price: number
    category: string
    description: string
    productType: 'physical' | 'digital'
    image?: File
  }) => Promise<{ success: boolean; message?: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; message?: string }>
  updateProduct: (id: string, productData: Partial<Product>) => Promise<{ success: boolean; message?: string }>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load products and categories on mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await productsAPI.getAll()

      if (response.success && response.data) {
        setProducts(response.data?.products || [])
      } else {
        setError(response.error || 'فشل تحميل المنتجات')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('حدث خطأ أثناء تحميل المنتجات')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProductsByCategory = async (categorySlug: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await productsAPI.getByCategory(categorySlug)

      if (response.success && response.data) {
        setProducts(response.data?.products || [])
      } else {
        setError(response.error || 'فشل تحميل المنتجات')
      }
    } catch (error) {
      console.error('Error fetching products by category:', error)
      setError('حدث خطأ أثناء تحميل المنتجات')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await productsAPI.getAll()

      if (response.success && response.data) {
        // Extract unique categories from products
        const categoryMap = new Map<string, Category>()
        response.data?.products?.forEach(product => {
          if (product.category && !categoryMap.has(product.category)) {
            categoryMap.set(product.category, {
              _id: product.category,
              name: product.category,
              slug: product.category?.name.toLowerCase().replace(/\s+/g, '-'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          }
        })

        setCategories(Array.from(categoryMap.values()))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getProductById = (_id: string): Product | undefined => {
    return products.find(product => product._id === _id)
  }

  const getCategoryById = (_id: string): Category | undefined => {
    return categories.find(category => category._id === _id)
  }

  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find(category => category.slug === slug)
  }

  const addProduct = async (productData: {
    name: string
    price: number
    category: string
    description: string
    productType: 'physical' | 'digital'
    image?: File
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await productsAPI.create(productData)
      if (response.success) {
        fetchProducts()
        return { success: true }
      } else {
        return { success: false, message: response.error }
      }
    } catch (error) {
      console.error('Error adding product:', error)
      return { success: false, message: 'حدث خطأ أثناء إضافة المنتج' }
    }
  }

  const deleteProduct = async (_id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await productsAPI.delete(_id)
      if (response.success) {
        fetchProducts()
        return { success: true }
      } else {
        return { success: false, message: response.error }
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, message: 'حدث خطأ أثناء حذف المنتج' }
    }
  }

  const updateProduct = async (_id: string, productData: Partial<Product>): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await productsAPI.update(_id, productData)
      if (response.success) {
        fetchProducts()
        return { success: true }
      } else {
        return { success: false, message: response.error }
      }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, message: 'حدث خطأ أثناء تحديث المنتج' }
    }
  }

  const value: ProductsContextType = {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchProductsByCategory,
    fetchCategories,
    getProductById,
    getCategoryById,
    getCategoryBySlug,
    addProduct,
    deleteProduct,
    updateProduct
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
} 