"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import Image from "next/image"
import { useProducts } from "@/contexts/products-context"
import { useCart } from "@/contexts/cart-context"

export default function FeaturedProducts() {
  const { getFeaturedProducts } = useProducts()
  const { addToCart } = useCart()
  
  const featuredProducts = getFeaturedProducts()

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">المنتجات المميزة</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            اكتشف أفضل المنتجات الرقمية المختارة خصيصاً لك. جودة عالية وأسعار منافسة.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card className="group overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <Link href={`/product/${product.id}`} className="block h-full flex flex-col">
                    <div className="relative w-full h-48 bg-slate-100 rounded-t-lg overflow-hidden">
                      <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} />
                      <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                        {product.category}
                      </div>
                      {product.isNew && (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">جديد</Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>
                        
                        {product.rating && (
                          <div className="flex items-center mb-3">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                            <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                            {product.reviewsCount && (
                              <span className="text-xs text-slate-500 mr-1">({product.reviewsCount})</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">{product.price.toFixed(2)} ر.س</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-slate-400 line-through">{product.originalPrice.toFixed(2)} ر.س</span>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-primary hover:bg-primary-dark text-white"
                          onClick={(e) => {
                            e.preventDefault()
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              category: product.category,
                              optionLabel: product.options?.[0]?.label,
                              platform: product.details?.platform,
                            })
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 ml-2" />
                          أضف إلى السلة
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-8">
          <Link href="/store">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
