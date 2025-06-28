"use client"

import { useAuth } from "@/contexts/auth-context"
import { useOrders } from "@/contexts/orders-context"
import { useCart } from "@/contexts/cart-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  User, 
  ShoppingBag, 
  Edit3, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react"

export default function AccountDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const { cartItems, getCartTotal } = useCart()

  // Calculate order statistics
  const totalOrders = orders.length
  const recentOrders = orders.slice(0, 5) // Last 5 orders
  const completedOrders = orders.filter(order => order.status === "مكتمل").length
  const pendingOrders = orders.filter(order => order.status === "قيد المعالجة").length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  // Get last login date
  const lastLogin = user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar-SA') : "غير محدد"

  // Get recent activity
  const recentActivity = [
    ...orders.slice(0, 3).map(order => ({
      type: "order",
      title: `طلب جديد #${order.id}`,
      description: `قيمة الطلب: ${order.total.toFixed(2)}ل.س`,
      date: new Date(order.createdAt).toLocaleDateString('ar-SA'),
      status: order.status
    }))
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            مرحباً بك، {user?.name || "المستخدم"}!
          </h1>
          <p className="text-slate-600">هذه لوحة التحكم الخاصة بحسابك في صديق</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">جميع الطلبات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">تم التسليم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الطلبات المعلقة</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">قيد المعالجة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإنفاق</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalSpent.toFixed(2)}ل.س</div>
              <p className="text-xs text-muted-foreground">جميع الطلبات</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 ml-2" />
                  الطلبات الأخيرة
                </CardTitle>
                <CardDescription>آخر 5 طلبات لك</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">طلب #{order.id}</h4>
                            <p className="text-sm text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{order.total.toFixed(2)}ل.س</div>
                          <Badge 
                            variant={
                              order.status === "مكتمل" ? "default" : 
                              order.status === "قيد المعالجة" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Link href="/account/orders" className="block mt-4">
                      <Button variant="outline" className="w-full">
                        عرض كل الطلبات
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700 mb-2">لا توجد طلبات بعد</h3>
                    <p className="text-slate-500 mb-4">ابدأ التسوق الآن لرؤية طلباتك هنا</p>
                    <Link href="/store">
                      <Button>تصفح المتجر</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معلومات الحساب</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-lg font-semibold">{user?.name}</div>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>
                <div className="text-xs text-slate-500">
                  آخر تسجيل دخول: {lastLogin}
                </div>
                <Link href="/account/profile" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit3 className="h-3 w-3 ml-1" /> تعديل الملف الشخصي
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Current Cart */}
            {cartItems.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">سلة التسوق الحالية</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-lg font-semibold">{cartItems.length} منتج</div>
                  <div className="text-sm text-slate-600">
                    الإجمالي: {getCartTotal().toFixed(2)}ل.س
                  </div>
                  <Link href="/cart" className="block">
                    <Button size="sm" className="w-full">
                      إتمام الشراء
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium">روابط سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/store" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 ml-2" />
                    تصفح المتجر
                  </Button>
                </Link>
                <Link href="/offers" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 ml-2" />
                    العروض الحالية
                  </Button>
                </Link>
                <Link href="/account/orders" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <Package className="h-4 w-4 ml-2" />
                    طلباتي
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
