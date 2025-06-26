"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  XCircle, 
  Info, 
  ShieldCheck,
  Check,
  Heart,
  Share2,
  Truck,
  Clock,
  CreditCard
} from "lucide-react"
import { useProducts } from "@/contexts/products-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function ProductDetailPage() {
  const params = useParams()
  const { getProductById } = useProducts()
  const { addToCart, cartItems } = useCart()
  const { toast } = useToast()
  
  const productId = params.id as string
  const product = getProductById(productId)

  const [selectedOptionSku, setSelectedOptionSku] = useState<string>("")
  const [mainImage, setMainImage] = useState<string>("")
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0)

  // Set initial values when product loads
  useEffect(() => {
    if (product) {
      setMainImage(product.images?.[0] || product.image)
      if (product.options && product.options.length > 0) {
        setSelectedOptionSku(product.defaultOptionSku || product.options[0].sku)
      }
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">المنتج غير موجود</h3>
            <p className="text-slate-500">المنتج الذي تبحث عنه غير متوفر أو تم حذفه.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get current option details
  const currentOption = product.options?.find(opt => opt.sku === selectedOptionSku)
  const currentPrice = currentOption?.price || product.price
  const currentAvailability = currentOption?.availability || product.availability

  // Check if product is in cart
  const isAdded = cartItems.some(item => item.id === product.id)

  const handleOptionChange = (sku: string) => {
    setSelectedOptionSku(sku)
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      quantity: 1,
      category: product.category,
      optionLabel: currentOption?.label,
      platform: product.details?.platform,
    }

    addToCart(cartItem)
    
    toast({
      title: "تم إضافة المنتج إلى السلة",
      description: `${product.name} تم إضافته إلى سلة التسوق بنجاح`,
    })
  }

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image)
    setActiveThumbnailIndex(index)
  }

  const isProductAvailable = currentAvailability === "متوفر"

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images - Left Column */}
          <div className="space-y-5 sticky top-24">
            <div className="bg-white p-4 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full h-96 bg-slate-100 rounded-lg overflow-hidden">
                <Image src={mainImage || "/placeholder.svg?width=800&height=800&query=Product+Main+Image"} alt={product.name} fill style={{ objectFit: "cover" }} />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="mt-4">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(img, index)}
                        className={cn(
                          "border-2 rounded-lg overflow-hidden aspect-square transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          activeThumbnailIndex === index
                            ? "border-primary shadow-md"
                            : "border-slate-200 hover:border-slate-400",
                        )}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info & CTA - Right Column */}
          <div className="space-y-6">
            {product.brandLogo && (
              <Image
                src={product.brandLogo || "/placeholder.svg"}
                alt={`${product.details?.platform || "Brand"} Logo`}
                width={100}
                height={35}
                className="h-8 w-auto object-contain"
              />
            )}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>

            <div className="flex items-center space-x-4 space-x-reverse">
              {product.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400 mr-1" />
                  <span className="font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
                  {product.reviewsCount && (
                    <span className="text-sm text-slate-500 ml-1.5">({product.reviewsCount} تقييم)</span>
                  )}
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs font-medium border-primary/50 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <p className="text-base text-slate-600 leading-relaxed">{product.shortDescription || product.description}</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-primary/20">
              <div className="flex items-baseline space-x-3 space-x-reverse mb-2">
                <span className="text-4xl font-bold text-primary">{currentPrice.toFixed(2)} ر.س</span>
                {product.originalPrice && currentPrice && product.originalPrice > currentPrice && (
                  <span className="text-xl text-slate-400 line-through">{product.originalPrice.toFixed(2)} ر.س</span>
                )}
              </div>
              {currentAvailability === "متوفر" && (
                <Badge className="bg-green-100 text-green-700 border-green-300 px-3 py-1 text-sm">
                  <CheckCircle className="h-4 w-4 ml-1.5" /> متوفر للتسليم الفوري
                </Badge>
              )}
              {currentAvailability === "نفد المخزون" && (
                <Badge variant="destructive" className="px-3 py-1 text-sm">
                  <XCircle className="h-4 w-4 ml-1.5" /> نفد المخزون
                </Badge>
              )}
              {currentAvailability === "قريباً" && (
                <Badge variant="outline" className="border-amber-400 text-amber-600 px-3 py-1 text-sm">
                  <Info className="h-4 w-4 ml-1.5" /> قريباً
                </Badge>
              )}
            </div>

            {product.options && product.options.length > 0 && (
              <div className="space-y-3 pt-2">
                <Label htmlFor="product-option" className="text-md font-semibold text-slate-800">
                  اختر الباقة المناسبة:
                </Label>
                <Select value={selectedOptionSku} onValueChange={handleOptionChange}>
                  <SelectTrigger id="product-option" className="w-full h-12 rounded-lg text-base">
                    <SelectValue placeholder="اختر الباقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.options.map((opt) => (
                      <SelectItem
                        key={opt.sku}
                        value={opt.sku}
                        disabled={opt.availability === "نفد المخزون"}
                        className="py-2.5 text-base"
                      >
                        {opt.label} ({opt.price.toFixed(2)} ر.س) {opt.availability === "نفد المخزون" ? "- نفد" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button
                size="xl"
                className={`w-full h-14 text-lg font-semibold rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 ${
                  isAdded 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
                onClick={handleAddToCart}
                disabled={!isProductAvailable}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5 ml-2.5" />
                    تم الإضافة للسلة
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 ml-2.5" />
                    {isProductAvailable ? "أضف إلى السلة" : "غير متوفر حالياً"}
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center text-sm text-slate-600 space-x-2 space-x-reverse">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span>دفع آمن 100% | تسليم فوري للأكواد</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion - Full Width Below */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            كل ما تحتاج معرفته عن المنتج
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border border-slate-200">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 text-slate-800">
                  الوصف الكامل للمنتج
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed px-6 pb-6 pt-0 text-base">
                  {product.longDescription || product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border border-slate-200">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 text-slate-800">
                  معلومات إضافية
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 px-6 pb-6 pt-0 text-base">
                  <ul className="space-y-2 list-disc list-inside pr-1 mt-2">
                    {product.details?.platform && (
                      <li>
                        <strong>المنصة:</strong> {product.details.platform}
                      </li>
                    )}
                    {product.details?.region && (
                      <li>
                        <strong>المنطقة:</strong> {product.details.region}
                      </li>
                    )}
                    {product.details?.validity && (
                      <li>
                        <strong>مدة الصلاحية:</strong> {product.details.validity}
                      </li>
                    )}
                    {product.details?.type && (
                      <li>
                        <strong>النوع:</strong> {product.details.type}
                      </li>
                    )}
                    {product.availableCodes !== undefined && (
                      <li>
                        <strong>الأكواد المتوفرة:</strong> {product.availableCodes} من {product.totalCodes}
                      </li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {product.usageInstructions && product.usageInstructions.length > 0 && (
                <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 text-slate-800">
                    كيفية الاستخدام
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 px-6 pb-6 pt-0 text-base">
                    <ol className="space-y-3 list-decimal list-inside pr-1 mt-2">
                      {product.usageInstructions.map((instruction, index) => (
                        <li key={index} className="leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
