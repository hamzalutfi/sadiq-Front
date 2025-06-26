"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, Filter, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  orderId: string
  customerEmail: string
  amount: number
  currency: string
  status: "ناجحة" | "فاشلة" | "معلقة" | "مستردة"
  paymentMethod: string
  gatewayTransactionId?: string
  timestamp: string
}

// Mock Data for transactions
const allTransactions: Transaction[] = Array.from({ length: 80 }, (_, i) => {
  const statuses: Transaction["status"][] = ["ناجحة", "فاشلة", "معلقة", "مستردة"]
  const methods = ["Visa", "Mastercard", "Mada", "Apple Pay", "STC Pay"]
  const orderId = `SAD-2024-${String(Math.floor(i / 2) + 1).padStart(4, "0")}`
  const date = new Date(Date.now() - i * 12 * 60 * 60 * 1000) // Transactions spread over time

  return {
    id: `txn_${Date.now()}_${i}`,
    orderId: orderId,
    customerEmail: `user${Math.floor(i / 2) + 1}@example.com`,
    amount: Number.parseFloat((Math.random() * 300 + 20).toFixed(2)),
    currency: "ر.س",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod: methods[Math.floor(Math.random() * methods.length)],
    gatewayTransactionId: `gw_${Math.random().toString(36).substring(2, 15)}`,
    timestamp: date.toISOString(),
  }
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const getStatusBadge = (status: Transaction["status"]) => {
  switch (status) {
    case "ناجحة":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          {status}
        </Badge>
      )
    case "فاشلة":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-300 hover:bg-red-100">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          {status}
        </Badge>
      )
    case "معلقة":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {status}
        </Badge>
      )
    case "مستردة":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          {status}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  // In a real app, filtering would be done on the backend via API calls
  const filteredTransactions = allTransactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.gatewayTransactionId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل عمليات الدفع</CardTitle>
        <CardDescription>عرض مفصل لجميع محاولات وعمليات الدفع التي تمت عبر بوابات الدفع.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Input
            placeholder="ابحث بمعرف العملية، الطلب، الإيميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" className="mr-auto sm:mr-0">
            <Filter className="h-4 w-4 ml-2" />
            فلترة متقدمة
          </Button>
          {/* Add export button if needed */}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">معرف العملية</TableHead>
                <TableHead>رقم الطلب</TableHead>
                <TableHead className="hidden md:table-cell">العميل</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="hidden lg:table-cell">طريقة الدفع</TableHead>
                <TableHead className="hidden sm:table-cell">التاريخ والوقت</TableHead>
                <TableHead>
                  <span className="sr-only">إجراءات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.slice(0, 15).map(
                (
                  transaction, // Paginate this in a real app
                ) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs">
                      {transaction.gatewayTransactionId || transaction.id}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${transaction.orderId}`} className="text-primary hover:underline">
                        {transaction.orderId}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{transaction.customerEmail}</TableCell>
                    <TableCell>
                      {transaction.amount.toFixed(2)} {transaction.currency}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{transaction.paymentMethod}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">
                      {new Date(transaction.timestamp).toLocaleString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileText className="h-3.5 w-3.5 mr-2 opacity-70" />
                            عرض تفاصيل العملية
                          </DropdownMenuItem>
                          {transaction.status === "ناجحة" && <DropdownMenuItem>محاولة استرداد المبلغ</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">لا توجد عمليات دفع تطابق بحثك.</p>
        )}
        {/* Add pagination component here */}
      </CardContent>
    </Card>
  )
}
