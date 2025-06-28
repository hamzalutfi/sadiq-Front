"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, User, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getAllOrders, updateOrderStatus } = useAdmin()
  
  const orderId = params.orderId as string
  const allOrders = getAllOrders()
  const order = allOrders.find(o => o.id === orderId)

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowRight className="h-4 w-4 ml-1" /> العودة إلى قائمة الطلبات
        </Button>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-slate-500">الطلب غير موجود</p>
          </CardContent>
        </Card>
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

  const handleStatusChange = (newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any)
    toast({
      title: "تم تحديث حالة الطلب",
      description: `تم تغيير حالة الطلب إلى ${getStatusText(newStatus)}`,
    })
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowRight className="h-4 w-4 ml-1" /> العودة إلى قائمة الطلبات
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>تفاصيل الطلب #{order.id}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">تاريخ الطلب</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">طريقة الدفع</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">الإجمالي الفرعي</p>
                  <p className="font-medium">{order.subtotal.toFixed(2)}ل.س</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">الضريبة</p>
                  <p className="font-medium">{order.tax.toFixed(2)}ل.س</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">الإجمالي النهائي</p>
                  <p className="text-xl font-bold text-primary">{order.total.toFixed(2)}ل.س</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المنتجات المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead className="text-left">السعر</TableHead>
                    <TableHead className="text-left">الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.optionLabel && (
                            <p className="text-sm text-slate-500">{item.optionLabel}</p>
                          )}
                          {item.platform && (
                            <p className="text-sm text-slate-500">{item.platform}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-left">{item.price.toFixed(2)}ل.س</TableCell>
                      <TableCell className="text-left">{(item.price * item.quantity).toFixed(2)}ل.س</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Customer Info & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 ml-2" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">الاسم</p>
                <p className="font-medium">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center">
                  <Mail className="h-4 w-4 ml-1" />
                  البريد الإلكتروني
                </p>
                <p className="font-medium">{order.customerInfo.email}</p>
              </div>
              {order.customerInfo.phone && (
                <div>
                  <p className="text-sm text-slate-500 flex items-center">
                    <Phone className="h-4 w-4 ml-1" />
                    رقم الهاتف
                  </p>
                  <p className="font-medium">{order.customerInfo.phone}</p>
                </div>
              )}
              {order.customerInfo.address && (
                <div>
                  <p className="text-sm text-slate-500 flex items-center">
                    <MapPin className="h-4 w-4 ml-1" />
                    العنوان
                  </p>
                  <p className="font-medium">{order.customerInfo.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">تغيير حالة الطلب</p>
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <CreditCard className="h-4 w-4 ml-2" />
                  إعادة إرسال إيصال الدفع
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 ml-2" />
                  إرسال تحديث للعميل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 