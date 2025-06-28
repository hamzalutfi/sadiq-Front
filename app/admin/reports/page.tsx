"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { DollarSign, ShoppingCart, Users, TrendingUp, Download, Calendar } from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
  const { getStats, getMonthlyStats, getAllOrders, getTopProducts } = useAdmin()
  
  const stats = getStats()
  const monthlyStats = getMonthlyStats()
  const allOrders = getAllOrders()
  const topProducts = getTopProducts()

  // Calculate order status distribution
  const orderStatusData = [
    { name: 'مكتمل', value: allOrders.filter(o => o.status === 'completed').length, color: '#10B981' },
    { name: 'قيد المعالجة', value: allOrders.filter(o => o.status === 'processing').length, color: '#3B82F6' },
    { name: 'في الانتظار', value: allOrders.filter(o => o.status === 'pending').length, color: '#F59E0B' },
    { name: 'ملغي', value: allOrders.filter(o => o.status === 'cancelled').length, color: '#EF4444' },
  ]

  // Calculate revenue by payment method
  const paymentMethodData = allOrders.reduce((acc, order) => {
    const method = order.paymentMethod
    if (!acc[method]) acc[method] = 0
    acc[method] += order.total
    return acc
  }, {} as Record<string, number>)

  const paymentMethodChartData = Object.entries(paymentMethodData).map(([method, revenue]) => ({
    name: method,
    revenue: revenue.toFixed(2)
  }))

  const handleExportReport = () => {
    const reportData = {
      stats,
      monthlyStats,
      topProducts,
      orderStatusData,
      paymentMethodData,
      generatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sadiq_report_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">التقارير والإحصائيات</h1>
          <p className="text-slate-600">نظرة شاملة على أداء المتجر</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 ml-2" />
          تصدير التقرير
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}ل.س</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyRevenue.toFixed(2)}ل.س هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyOrders} طلب هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyUsers} مستخدم جديد هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)}ل.س</div>
            <p className="text-xs text-muted-foreground">
              متوسط قيمة الطلب الواحد
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}ل.س`, "الإيرادات"]} />
                <Line type="monotone" dataKey="revenue" stroke="#0B8A3D" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات حسب طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: string) => [`${value}ل.س`, "الإيرادات"]} />
                <Bar dataKey="revenue" fill="#0B8A3D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sales} مبيعة</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {product.revenue.toFixed(2)}ل.س
                  </Badge>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  لا توجد منتجات مبيعة بعد
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allOrders.slice(0, 10).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-sm">
                      طلب جديد من {order.customerInfo.firstName} {order.customerInfo.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')} - {order.total.toFixed(2)}ل.س
                    </p>
                  </div>
                </div>
                <Badge className={order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {order.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                </Badge>
              </div>
            ))}
            {allOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                لا توجد نشاطات حديثة
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
