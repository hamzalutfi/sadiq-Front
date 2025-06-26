"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useOrders } from "@/contexts/orders-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Filter, Eye, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}

function OrdersContent() {
  const { user } = useAuth()
  const { getUserOrders } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const userOrders = user ? getUserOrders(user.id) : []
  const sortedOrders = userOrders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const getTotalItems = (order: any) => {
    return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">طلباتي</h1>
          <p className="text-slate-600">تتبع جميع طلباتك وحالة تسليمها</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث في الطلبات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="حالة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الطلبات</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {userOrders.length === 0 ? "لا توجد طلبات بعد" : "لا توجد نتائج"}
              </h3>
              <p className="text-slate-600 mb-6">
                {userOrders.length === 0 
                  ? "ابدأ التسوق الآن لإنشاء طلبك الأول"
                  : "جرب تغيير معايير البحث"
                }
              </p>
              {userOrders.length === 0 && (
                <Link href="/store">
                  <Button className="bg-primary hover:bg-primary-dark">
                    ابدأ التسوق
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold text-slate-900">طلب #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                        <div>
                          <span className="block text-slate-500">تاريخ الطلب:</span>
                          <span className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div>
                          <span className="block text-slate-500">عدد المنتجات:</span>
                          <span className="font-medium">{getTotalItems(order)}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500">الإجمالي:</span>
                          <span className="font-medium">{order.total.toFixed(2)} ر.س</span>
                        </div>
                        <div>
                          <span className="block text-slate-500">طريقة الدفع:</span>
                          <span className="font-medium">{order.paymentMethod}</span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                الكمية: {item.quantity} × {item.price.toFixed(2)} ر.س
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-slate-500">
                            +{order.items.length - 2} منتجات أخرى
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:flex-shrink-0">
                      <Link href={`/order-success/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 ml-2" />
                          عرض التفاصيل
                        </Button>
                      </Link>
                      {order.status === "completed" && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 ml-2" />
                          تحميل الأكواد
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {userOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>ملخص الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{userOrders.length}</div>
                  <div className="text-sm text-slate-600">إجمالي الطلبات</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {userOrders.filter(o => o.status === "completed").length}
                  </div>
                  <div className="text-sm text-slate-600">مكتملة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {userOrders.filter(o => o.status === "processing").length}
                  </div>
                  <div className="text-sm text-slate-600">قيد المعالجة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {userOrders.filter(o => o.status === "pending").length}
                  </div>
                  <div className="text-sm text-slate-600">في الانتظار</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
