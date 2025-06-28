"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, PlusCircle, MinusCircle, Tag, ArrowRight, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getCartTotal()
  const total = subtotal - discount

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toUpperCase() === "SADIQ10") {
      setDiscount(subtotal * 0.1) // 10% discount
    } else {
      setDiscount(0)
      alert("كود الخصم غير صالح أو منتهي الصلاحية.")
    }
  }

  if (cartItems?.length === 0) {
    return (
      <div className="container py-12 md:py-20 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto text-slate-300 mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">عربة التسوق فارغة</h1>
        <p className="text-slate-600 mb-8">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
        <Link href="/store" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
            ابدأ التسوق الآن
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center md:text-right">عربة التسوق</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item._id} className="overflow-hidden shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-28 sm:w-20 sm:h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || (typeof item.product.image === 'string' ? item.product.image : "/placeholder.svg")} alt={item.name || item.product.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{item.name || item.product.name}</h3>
                    {item.optionLabel && <p className="text-sm text-slate-500">{item.optionLabel}</p>}
                    <p className="text-sm text-slate-500">{item.platform || item.product.category}</p>
                    <p className="font-semibold text-primary mt-1">{(item.price || item.product.price || 0).toFixed(2)}ل.س</p>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse my-2 sm:my-0">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <PlusCircle className="h-5 w-5 text-slate-500 hover:text-primary" />
                    </Button>
                    <span className="text-md font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle className="h-5 w-5 text-slate-500 hover:text-primary" />
                    </Button>
                  </div>
                  <p className="text-md font-bold text-primary hidden sm:block w-24 text-left">
                    {((item.price || item.product.price || 0) * item.quantity).toFixed(2)}ل.س
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item._id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-28">
              <CardHeader>
                <CardTitle className="text-2xl">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>الإجمالي الفرعي</span>
                  <span>{subtotal.toFixed(2)}ل.س</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم (كوبون)</span>
                    <span>-{discount.toFixed(2)}ل.س</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>الإجمالي النهائي</span>
                  <span>{total.toFixed(2)}ل.س</span>
                </div>
                <div className="pt-2 space-y-2">
                  <label htmlFor="coupon" className="text-sm font-medium text-slate-700">
                    هل لديك كوبون خصم؟
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="أدخل كود الكوبون"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-10 rounded-md"
                    />
                    <Button
                      onClick={applyCoupon}
                      variant="outline"
                      className="h-10 rounded-md text-primary border-primary hover:bg-primary/10"
                    >
                      <Tag className="h-4 w-4 ml-1" /> تطبيق
                    </Button>
                  </div>
                </div>
                <Link href="/checkout" passHref className="block pt-2">
                  <Button size="lg" className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-lg">
                    الانتقال إلى الدفع <ArrowRight className="h-5 w-5 mr-2" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 text-center pt-2">
                  الأسعار شاملة ضريبة القيمة المضافة (إذا كانت مطبقة).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
