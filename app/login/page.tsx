"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get("reset") === "success"
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) return

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      router.push("/dashboard")
    } else {
      setMessage(result.message || "حدث خطأ أثناء تسجيل الدخول")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <Image src="/logo.png" alt="Sadiq Logo" width={120} height={60} className="mx-auto" />
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>مرحباً بعودتك! أدخل بياناتك للمتابعة.</CardDescription>
        </CardHeader>
        <CardContent>
          {resetSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle className="h-4 w-4" />
              <p>تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="mail@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  هل نسيت كلمة المرور؟
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="remember" 
                name="remember" 
                checked={formData.remember}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, remember: checked as boolean }))
                }
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                تذكرني
              </Label>
            </div>
            {message && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-4 w-4" />
                <p>{message}</p>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white" 
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary-dark">
              أنشئ حساباً
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
