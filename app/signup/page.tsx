"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, XCircle, Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

function PasswordValidationRule({ isMet, text }: { isMet: boolean; text: string }) {
  return (
    <div className="flex items-center text-sm">
      {isMet ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 rtl:ml-2 rtl:mr-0" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground mr-2 rtl:ml-2 rtl:mr-0" />
      )}
      <span className={isMet ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}

export default function SignUpPage() {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  }
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0

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

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل"
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة"
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين"
    }

    if (!formData.terms) {
      newErrors.terms = "يجب الموافقة على الشروط والأحكام"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) return

    const result = await signup(formData.name, formData.email, formData.password)
    
    if (result.success) {
      router.push("/welcome")
    } else {
      setMessage(result.message || "حدث خطأ أثناء إنشاء الحساب")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4" dir="rtl">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-4">
          <Link href="/" passHref>
            <Image src="/logo.png" alt="Sadiq Logo" width={120} height={60} className="mx-auto cursor-pointer" />
          </Link>
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>انضم إلينا وابدأ رحلتك في عالم البطاقات الرقمية والاشتراكات.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="مثال: عبدالله محمد" 
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
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
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 rtl:pr-10 rtl:pl-3 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="space-y-1.5 pt-1">
              <PasswordValidationRule isMet={passwordRules.length} text="8 أحرف على الأقل" />
              <PasswordValidationRule isMet={passwordRules.uppercase} text="حرف كبير واحد على الأقل (A-Z)" />
              <PasswordValidationRule isMet={passwordRules.number} text="رقم واحد على الأقل (0-9)" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 rtl:pr-10 rtl:pl-3 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
              {formData.password.length > 0 && formData.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1">كلمتا المرور غير متطابقتين.</p>
              )}
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="terms" 
                name="terms" 
                checked={formData.terms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, terms: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                أوافق على{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  سياسة الخصوصية
                </Link>
                .
              </Label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

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
              {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
              سجل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
