"use client"

import Link from "next/link"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Mail, Calendar, ShoppingBag, CircleDollarSign } from "lucide-react"

// Mock data - this would be fetched from the backend using userId
const mockUserDetail = {
  id: "user_1",
  name: "علي الأحمدي",
  email: "user1@example.com",
  avatar: "https://i.pravatar.cc/80?u=user1",
  registrationDate: "2024-06-25",
  totalSpent: 1250.75,
  status: "نشط",
  orders: [
    { id: "SAD-001", date: "2024-06-25", status: "مكتمل", total: 120.0 },
    { id: "SAD-015", date: "2024-05-10", status: "مكتمل", total: 75.5 },
    { id: "SAD-032", date: "2024-04-01", status: "ملغي", total: 45.0 },
    { id: "SAD-050", date: "2024-02-20", status: "مكتمل", total: 1010.25 },
  ],
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  // In a real app, you would fetch user details based on userId
  const user = mockUserDetail

  if (!user) {
    return <div>المستخدم غير موجود.</div>
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowRight className="h-4 w-4 ml-1" /> العودة إلى قائمة المستخدمين
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center gap-4">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <Badge
                  className={user.status === "نشط" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                >
                  {user.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 ml-1" /> {user.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-1" /> تاريخ التسجيل: {user.registrationDate}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center">
                <ShoppingBag className="h-4 w-4 ml-1" /> إجمالي الطلبات
              </p>
              <p className="text-2xl font-bold">{user.orders.length} طلبات</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center">
                <CircleDollarSign className="h-4 w-4 ml-1" /> إجمالي الإنفاق
              </p>
              <p className="text-2xl font-bold">{user.totalSpent.toFixed(2)}ل.س</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">سجل الطلبات</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === "مكتمل" ? "default" : "destructive"}
                        className={order.status === "مكتمل" ? "bg-green-500" : ""}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">{order.total.toFixed(2)}ل.س</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
