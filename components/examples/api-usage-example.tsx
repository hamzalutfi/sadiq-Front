"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useProducts } from '@/contexts/products-context'
import { productsAPI, cartAPI } from '@/lib/api'
import { Product } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function ApiUsageExample() {
  const { isAuthenticated, user } = useAuth()
  const { cart, addToCart, isLoading: cartLoading } = useCart()
  const { products, isLoading: productsLoading, error } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Example: Fetch a specific product
  const fetchProduct = async (productId: string) => {
    try {
      const response = await productsAPI.getById(productId)
      if (response.success && response.data) {
        setSelectedProduct(response.data)
        toast.success('Product loaded successfully!')
      } else {
        toast.error(response.error || 'Failed to load product')
      }
    } catch (error) {
      toast.error('Error loading product')
    }
  }

  // Example: Add product to cart
  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    const result = await addToCart(productId, 1)
    if (result.success) {
      toast.success('Product added to cart!')
    } else {
      toast.error(result.message || 'Failed to add to cart')
    }
  }

  // Example: Apply coupon
  const applyCoupon = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply coupons')
      return
    }

    try {
      const response = await cartAPI.applyCoupon('DISCOUNT10')
      if (response.success) {
        toast.success('Coupon applied successfully!')
      } else {
        toast.error(response.error || 'Failed to apply coupon')
      }
    } catch (error) {
      toast.error('Error applying coupon')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Authentication Status</h3>
            <p>Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
            {user && (
              <p>User: {user.fullName} ({user.email})</p>
            )}
          </div>

          {/* Products Loading */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Products</h3>
            {productsLoading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div>
                <p>Total Products: {products.length}</p>
                <div className="mt-2 space-y-2">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span>{product.name} - ${product.price}</span>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToCart(product.id)}
                        disabled={cartLoading}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Cart Status</h3>
            {cartLoading ? (
              <p>Loading cart...</p>
            ) : cart ? (
              <div>
                <p>Items in cart: {cart.items.length}</p>
                <p>Total: ${cart.finalTotal}</p>
                {cart.appliedCoupon && (
                  <p>Applied coupon: {cart.appliedCoupon}</p>
                )}
                <Button onClick={applyCoupon} className="mt-2">
                  Apply Test Coupon
                </Button>
              </div>
            ) : (
              <p>No items in cart</p>
            )}
          </div>

          {/* API Call Example */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Direct API Call Example</h3>
            <Button 
              onClick={() => fetchProduct('sample-product-id')}
              variant="outline"
            >
              Fetch Sample Product
            </Button>
            {selectedProduct && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p><strong>Selected Product:</strong></p>
                <p>Name: {selectedProduct.name}</p>
                <p>Price: ${selectedProduct.price}</p>
                <p>Category: {selectedProduct.category}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Example of using the API in a server component (if needed)
export async function ServerSideExample() {
  // Note: This would be used in a server component
  // const products = await productsAPI.getAll()
  
  return (
    <div>
      <h2>Server-Side API Usage</h2>
      <p>This example shows how to use the API in server components.</p>
      <p>Note: Server components can make direct API calls without authentication context.</p>
    </div>
  )
} 