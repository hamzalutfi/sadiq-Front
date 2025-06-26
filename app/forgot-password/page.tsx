"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { requestPasswordReset } from "../actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white" disabled={pending}>
      {pending ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
    </Button>
  )
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <Image src="/logo.png" alt="Sadiq Logo" width={120} height={60} className="mx-auto" />
          <CardTitle className="text-2xl font-bold">استعادة كلمة المرور</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة مرورك.</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <div className="flex flex-col items-center text-center gap-2 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <CheckCircle className="h-8 w-8" />
              <p className="font-semibold">تم إرسال التعليمات</p>
              <p>{state.message}</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" placeholder="mail@example.com" required />
                {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
              </div>
              <SubmitButton />
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
