"use client"

import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingCart, Package, User } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <ProtectedRoute>
      <WelcomeContent />
    </ProtectedRoute>
  )
}

function WelcomeContent() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">مرحباً بك في صديق!</CardTitle>
          <p className="text-slate-600 text-lg">
            تم إنشاء حسابك بنجاح، {user?.name}! 🎉
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">معلومات حسابك:</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>الاسم:</strong> {user?.name}</p>
              <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
              <p><strong>تاريخ الإنشاء:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">تصفح المتجر</h4>
              <p className="text-sm text-slate-600">اكتشف منتجاتنا المميزة</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">تتبع طلباتك</h4>
              <p className="text-sm text-slate-600">راقب حالة طلباتك</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <User className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">إدارة الحساب</h4>
              <p className="text-sm text-slate-600">عدّل معلوماتك الشخصية</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/store" className="flex-1">
              <Button className="w-full h-12 text-lg">
                <ShoppingCart className="h-5 w-5 ml-2" />
                ابدأ التسوق الآن
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full h-12 text-lg">
                <User className="h-5 w-5 ml-2" />
                لوحة التحكم
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
            <p>هل لديك أسئلة؟ يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف.</p>
            <p className="mt-1">شكراً لانضمامك إلى عائلة صديق! 🚀</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
