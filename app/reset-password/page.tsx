"use client"

import { useState, useActionState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, XCircle, Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { resetPassword } from "../actions"
import { useFormStatus } from "react-dom"

function PasswordValidationRule({ isMet, text }: { isMet: boolean; text: string }) {
  return (
    <div className="flex items-center text-sm">
      {isMet ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground mr-2" />
      )}
      <span className={isMet ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={pending}>
      {pending ? "جاري التعيين..." : "إعادة تعيين كلمة المرور"}
    </Button>
  )
}

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, formAction] = useActionState(resetPassword, null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  }

  if (!token) {
    return (
      <div className="text-center text-red-600">
        <p>رابط إعادة التعيين غير صالح أو مفقود.</p>
        <Link href="/forgot-password" className="text-primary hover:underline mt-2 inline-block">
          اطلب رابطاً جديداً
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">كلمة المرور الجديدة</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
      </div>
      <div className="space-y-2 pt-2">
        <PasswordValidationRule isMet={passwordRules.length} text="8 أحرف على الأقل" />
        <PasswordValidationRule isMet={passwordRules.uppercase} text="حرف كبير واحد على الأقل (A-Z)" />
        <PasswordValidationRule isMet={passwordRules.number} text="رقم واحد على الأقل (0-9)" />
      </div>
      <div>
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
        {state?.errors?.confirmPassword && <p className="text-red-500 text-xs mt-1">{state.errors.confirmPassword}</p>}
      </div>
      {state?.message && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <p>{state.message}</p>
        </div>
      )}
      <SubmitButton />
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <Image src="/logo.png" alt="Sadiq Logo" width={120} height={60} className="mx-auto" />
          <CardTitle className="text-2xl font-bold">تعيين كلمة مرور جديدة</CardTitle>
          <CardDescription>اختر كلمة مرور قوية لحماية حسابك.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
