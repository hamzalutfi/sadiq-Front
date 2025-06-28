"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Download, ArrowRight, Home, User } from "lucide-react"
import { useOrders } from "@/contexts/orders-context"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <OrderSuccessContent />
    </ProtectedRoute>
  )
}

function OrderSuccessContent() {
  const { orderId } = useParams()
  const { getOrderById } = useOrders()
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState(getOrderById(orderId as string))

  useEffect(() => {
    const foundOrder = getOrderById(orderId as string)
    if (!foundOrder) {
      router.push("/dashboard")
      return
    }
    setOrder(foundOrder)
  }, [orderId, getOrderById, router])

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل"
      case "processing":
        return "قيد المعالجة"
      case "pending":
        return "في الانتظار"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            تم إتمام طلبك بنجاح!
          </h1>
          <p className="text-slate-600 text-lg">
            شكراً لك على الشراء من صديق. سيتم تسليم المنتجات الرقمية قريباً.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 ml-2" />
                  تفاصيل الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">رقم الطلب:</span>
                    <p className="font-medium">{order._id}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">تاريخ الطلب:</span>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">حالة الطلب:</span>
                    <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500">طريقة الدفع:</span>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">المنتجات المطلوبة:</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: "cover" }} />
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-slate-700">{item.name}</p>
                          {item.optionLabel && (
                            <p className="text-sm text-slate-500">{item.optionLabel}</p>
                          )}
                          {item.platform && (
                            <p className="text-sm text-slate-500">{item.platform}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">
                            {(item.price * item.quantity).toFixed(2)}ل.س
                          </p>
                          {item.code && (
                            <p className="text-xs text-green-600 mt-1">تم التسليم</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">الإجمالي الفرعي:</span>
                    <span className="font-medium">{order.pricing.subtotal.toFixed(2)}ل.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">الشحن:</span>
                    <span className="font-medium">مجاني</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t pt-2">
                    <span>الإجمالي:</span>
                    <span>{order.pricing.total.toFixed(2)}ل.س</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            {/* <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">الاسم:</span>
                    <p className="font-medium">
                      {order.customerInfo.firstName} {order.customerInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">البريد الإلكتروني:</span>
                    <p className="font-medium">{order.customerInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/account/orders" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 ml-2" />
                    عرض جميع طلباتي
                  </Button>
                </Link>
                <Link href="/store" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 ml-2" />
                    متابعة التسوق
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 ml-2" />
                    لوحة التحكم
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">معلومات مهمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>سيتم تسليم المنتجات الرقمية عبر البريد الإلكتروني</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>يمكنك تتبع حالة طلبك من صفحة "طلباتي"</p>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>الأكواد صالحة للاستخدام فور استلامها</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              <Home className="h-5 w-5 ml-2" />
            العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 