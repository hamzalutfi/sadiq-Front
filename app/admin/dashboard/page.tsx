"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { DollarSign, ShoppingCart, Users, BarChart2, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useAdmin } from "@/contexts/admin-context"

export default function AdminDashboardPage() {
  const { getStats, getMonthlyStats, getAllOrders, getTopProducts } = useAdmin()

  const stats = getStats()
  const monthlyStats = getMonthlyStats()
  const recentOrders = getAllOrders()?.slice(0, 5)
  const topProducts = getTopProducts()

  const statsCards = [
    {
      title: "إجمالي الإيرادات (هذا الشهر)",
      value: `${stats?.monthlyRevenue?.toFixed(2) || '0.00'}ل.س`,
      change: (stats?.monthlyRevenue || 0) > 0 ? "+" : "",
      icon: DollarSign,
      trend: (stats?.monthlyRevenue || 0) > 0 ? "up" : "down"
    },
    {
      title: "عدد الطلبات (هذا الشهر)",
      value: `${stats?.monthlyOrders || 0}`,
      change: (stats?.monthlyOrders || 0) > 0 ? "+" : "",
      icon: ShoppingCart,
      trend: (stats?.monthlyOrders || 0) > 0 ? "up" : "down"
    },
    {
      title: "المستخدمون الجدد (هذا الشهر)",
      value: `${stats?.monthlyUsers || 0}`,
      change: (stats?.monthlyUsers || 0) > 0 ? "+" : "",
      icon: Users,
      trend: (stats?.monthlyUsers || 0) > 0 ? "up" : "down"
    },
    {
      title: "متوسط قيمة الطلب",
      value: `${stats?.averageOrderValue?.toFixed(2) || '0.00'}ل.س`,
      change: (stats?.averageOrderValue || 0) > 0 ? "+" : "",
      icon: BarChart2,
      trend: (stats?.averageOrderValue || 0) > 0 ? "up" : "down"
    },
  ]

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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
                )}
                {card.change} عن الشهر الماضي
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>نظرة عامة على المبيعات</CardTitle>
            <CardDescription>إجمالي المبيعات الشهرية لآخر 12 شهراً.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}ل.س`}
                />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}ل.س`, "المبيعات"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0B8A3D" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      Order #{order._id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">{order.pricing.total.toFixed(2)}ل.س</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link href="/admin/orders" className="block text-center mt-4 text-sm text-primary hover:underline">
              عرض جميع الطلبات
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts?.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-grow">
                  <p className="text-sm font-medium">{product.product.name}</p>
                  <p className="text-xs text-slate-500">{product.revenue.toFixed(2)}ل.س إجمالي المبيعات</p>
                </div>
                <div className="text-sm font-semibold">{product.quantity} مبيعة</div>
              </div>
            ))}
            {(!topProducts || topProducts.length === 0) && (
              <div className="text-center py-8 text-slate-500">
                لا توجد منتجات مبيعة بعد
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
