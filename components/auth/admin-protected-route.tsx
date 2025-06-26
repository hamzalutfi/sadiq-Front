"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, LogIn } from "lucide-react"
import Link from "next/link"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const { isAdmin } = useAdmin()
  const router = useRouter()

  // Debug logging
  console.log("Admin Protected Route Debug:", {
    isAuthenticated,
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    isAdmin,
    isLoading
  })

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return
    
    // Temporarily allow admin access for testing
    // if (!isAuthenticated) {
    //   console.log("Redirecting to login - not authenticated")
    //   router.push("/login")
    // } else if (!isAdmin) {
    //   console.log("Redirecting to dashboard - not admin")
    //   router.push("/dashboard")
    // }
    
    // For testing: allow access without authentication
    console.log("Admin access allowed for testing")
  }, [isAuthenticated, isAdmin, router, isLoading])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>يجب تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">يجب تسجيل الدخول للوصول إلى لوحة الإدارة</p>
            <Link href="/login">
              <Button className="w-full">
                <LogIn className="h-4 w-4 ml-2" />
                تسجيل الدخول
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>غير مصرح بالوصول</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">ليس لديك صلاحيات للوصول إلى لوحة الإدارة</p>
            <Link href="/dashboard">
              <Button className="w-full">
                العودة للوحة التحكم
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">جاري التحقق من الصلاحيات...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 