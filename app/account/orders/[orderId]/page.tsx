"use client"

import { useParams, useRouter } from "next/navigation" // useRouter for back navigation
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ArrowRight, Calendar, CircleDollarSign, Hash, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface OrderItemDetail {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  digitalCode?: string // The purchased digital code
  optionLabel?: string
}

interface OrderDetail {
  id: string
  orderNumber: string
  date: string
  totalAmount: number
  status: "مكتمل" | "قيد المعالجة" | "ملغي" | "تم التوصيل"
  items: OrderItemDetail[]
  // Add other details like shipping address if applicable, payment method, etc.
  paymentMethod?: string
  customerNotes?: string
}

// Mock order details data - in a real app, fetch this by orderId
const mockOrderDetails: OrderDetail[] = [
  {
    id: "order_123xyz",
    orderNumber: "SAD-20240625-001",
    date: "2024-06-25",
    totalAmount: 120.5,
    status: "مكتمل",
    paymentMethod: "Visa **** **** **** 1234",
    items: [
      {
        id: "item_a",
        productId: "prod_psn20",
        productName: "بطاقة PlayStation Store بقيمة 20$ - المتجر الأمريكي",
        productImage: "/placeholder.svg?width=80&height=100",
        quantity: 1,
        price: 75.0,
        digitalCode: "PSN-ABCD-EFGH-IJKL",
        optionLabel: "بطاقة 20$",
      },
      {
        id: "item_b",
        productId: "prod_netflix1m",
        productName: "اشتراك Netflix Premium - شهر واحد",
        productImage: "/placeholder.svg?width=80&height=100",
        quantity: 1,
        price: 45.5,
        digitalCode: "NFLX-1234-5678-9012",
      },
    ],
  },
  {
    id: "order_456abc",
    orderNumber: "SAD-20240620-005",
    date: "2024-06-20",
    totalAmount: 75.0,
    status: "تم التوصيل",
    paymentMethod: "Apple Pay",
    items: [
      {
        id: "item_c",
        productId: "prod_xbox_ultimate",
        productName: "Xbox Game Pass Ultimate - شهر",
        productImage: "/placeholder.svg?width=80&height=100",
        quantity: 1,
        price: 75.0,
        digitalCode: "XBOX-ULTM-9876-5432",
      },
    ],
  },
  // Add more mock orders if needed to match the list page
]

const getStatusBadgeVariant = (status: OrderDetail["status"]) => {
  switch (status) {
    case "مكتمل":
    case "تم التوصيل":
      return "bg-green-100 text-green-700 border-green-300"
    case "قيد المعالجة":
      return "bg-blue-100 text-blue-700 border-blue-300"
    case "ملغي":
      return "bg-red-100 text-red-700 border-red-300"
    default:
      return "secondary"
  }
}

function DigitalCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  return (
    <div className="mt-2 bg-primary/5 border border-primary/20 rounded-md p-3 flex items-center justify-between">
      <span className="font-mono text-primary font-semibold tracking-wider text-sm md:text-base">{code}</span>
      <Button variant="ghost" size="sm" onClick={handleCopy} className="text-primary hover:bg-primary/20">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="mr-1 text-xs">{copied ? "تم النسخ!" : "نسخ"}</span>
      </Button>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderDetail | null>(null)

  useEffect(() => {
    // Simulate fetching order details
    const foundOrder = mockOrderDetails.find((o) => o.id === orderId)
    setOrder(foundOrder || null)
  }, [orderId])

  if (!order) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>تفاصيل الطلب</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p>جاري تحميل تفاصيل الطلب...</p>
          {/* Add a spinner or skeleton loader here */}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-2xl text-slate-800">تفاصيل الطلب</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Hash className="h-4 w-4 ml-1 text-slate-500" />
              {order.orderNumber}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="self-start sm:self-center">
            <ArrowRight className="h-4 w-4 ml-1" /> العودة إلى الطلبات
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-slate-500 mb-0.5">تاريخ الطلب:</p>
            <p className="font-medium text-slate-700 flex items-center">
              <Calendar className="h-4 w-4 ml-1 text-primary" />
              {new Date(order.date).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-slate-500 mb-0.5">الإجمالي:</p>
            <p className="font-medium text-slate-700 flex items-center">
              <CircleDollarSign className="h-4 w-4 ml-1 text-primary" />
              {order.totalAmount.toFixed(2)} ر.س
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-md">
            <p className="text-slate-500 mb-0.5">حالة الطلب:</p>
            <Badge variant="outline" className={`px-2 py-0.5 ${getStatusBadgeVariant(order.status)}`}>
              {order.status}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">المنتجات المطلوبة</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                    <Image src={item.productImage || "/placeholder.svg"} alt={item.productName} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/product/${item.productId}`} className="hover:underline">
                      <h4 className="font-semibold text-slate-700 text-md">{item.productName}</h4>
                    </Link>
                    {item.optionLabel && <p className="text-xs text-slate-500">الخيار: {item.optionLabel}</p>}
                    <p className="text-sm text-slate-600">
                      الكمية: {item.quantity} | السعر: {item.price.toFixed(2)} ر.س
                    </p>
                    {item.digitalCode && (order.status === "مكتمل" || order.status === "تم التوصيل") ? (
                      <DigitalCodeDisplay code={item.digitalCode} />
                    ) : (
                      <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                        سيظهر الكود الرقمي هنا عند اكتمال الطلب.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">معلومات إضافية</h3>
          <div className="text-sm space-y-1 text-slate-600">
            {order.paymentMethod && (
              <p>
                <strong>طريقة الدفع:</strong> {order.paymentMethod}
              </p>
            )}
            {/* Add more details like shipping, billing address if applicable */}
            <p className="flex items-center pt-2">
              <ShieldCheck className="h-4 w-4 ml-1 text-primary" />
              <span>جميع الأكواد الرقمية يتم تسليمها بشكل آمن وفوري.</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
