"use client"

import type React from "react"
import { useState } from "react"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon, Star, Check } from "lucide-react"
import type { StoreProduct } from "@/lib/mock-products"
import { useCart } from "@/contexts/cart-context"
import { getImageUrl } from "@/lib/utils"

interface ProductCardProps {
  product: StoreProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent link navigation when clicking the button
    e.stopPropagation() // Prevent event bubbling

    addToCart(product._id, 1)
    setIsAdded(true)

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }
  return (
    <Card className="group overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link href={`/product/${product._id}`} className="block h-full flex flex-col">
        <div className="relative w-full h-48 bg-slate-100 rounded-t-lg overflow-hidden">
          <Image src={getImageUrl(product.image)} alt={product.name} fill style={{ objectFit: "cover" }} />
          {product.isNew && <Badge className="absolute top-3 right-3 bg-primary text-white">جديد</Badge>}
        </div>
        <CardContent className="p-4 flex-grow">
          <p className="text-xs text-slate-500 mb-1">{product.platform}</p>
          <h3 className="text-md font-semibold text-slate-800 leading-tight h-12 mb-2 overflow-hidden group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">{product.price.toFixed(2)}ل.س</p>
            {product.rating && (
              <div className="flex items-center text-sm text-slate-500">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                {product.rating.toFixed(1)}
              </div>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-sm text-slate-400 line-through mt-1">{product.originalPrice.toFixed(2)}ل.س</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            size="sm"
            className={`w-full font-semibold rounded-lg h-10 transition-all duration-200 ${isAdded
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-primary hover:bg-primary-dark text-white"
              }`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 ml-2" />
                تم الإضافة
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4 ml-2" />
                أضف للسلة
              </>
            )}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
