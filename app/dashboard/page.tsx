"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useOrders } from "@/contexts/orders-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, ShoppingCart, Package, Settings, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { cartItems, getCartCount, getCartTotal } = useCart()
  const { getUserOrders } = useOrders()

  const userOrders = user ? getUserOrders(user.id) : []
  const recentOrders = userOrders.slice(0, 3) // Show last 3 orders
  const completedOrders = userOrders.filter(order => order.status === "completed").length
  const pendingOrders = userOrders.filter(order => order.status === "pending" || order.status === "processing").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
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
      case "cancelled":
        return "ملغي"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">مرحباً، {user?.name}!</h1>
          <p className="text-slate-600">مرحباً بك في لوحة تحكم حسابك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {userOrders.length === 0 ? "لم تقم بأي طلب بعد" : `${completedOrders} مكتملة`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عربة التسوق</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCartCount()}</div>
              <p className="text-xs text-muted-foreground">
                {getCartCount() === 0 ? "لا توجد منتجات في السلة" : `${getCartTotal().toFixed(2)}ل.س`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات المعلقة</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders === 0 ? "لا توجد طلبات معلقة" : "قيد المعالجة"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الحساب</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">نشط</div>
              <p className="text-xs text-muted-foreground">تم إنشاء الحساب بنجاح</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">الاسم</label>
                <p className="text-slate-900">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                <p className="text-slate-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">تاريخ الإنشاء</label>
                <p className="text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}
                </p>
              </div>
              <Link href="/account/profile">
                <Button variant="outline" className="w-full">
                  تعديل الملف الشخصي
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/store">
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  تصفح المتجر
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="outline" className="w-full">
                  <Package className="h-4 w-4 ml-2" />
                  عرض طلباتي
                </Button>
              </Link>
              <Link href="/account/profile">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 ml-2" />
                  إعدادات الحساب
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>آخر الطلبات</CardTitle>
              <Link href="/account/orders">
                <Button variant="outline" size="sm">
                  عرض الكل
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">طلب #{order._id}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')} • {order.items.length} منتجات
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{order.pricing.total.toFixed(2)}ل.س</span>
                      <Link href={`/order-success/${order._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Orders */}
        {userOrders.length === 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>ابدأ رحلتك مع صديق</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">لا توجد طلبات بعد</h3>
              <p className="text-slate-600 mb-6">ابدأ التسوق الآن لإنشاء طلبك الأول</p>
              <Link href="/store">
                <Button size="lg" className="bg-primary hover:bg-primary-dark">
                  ابدأ التسوق
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
