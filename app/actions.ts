"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { authAPI } from "@/lib/api"

// تعريف مخطط التحقق باستخدام Zod
const signupSchema = z
  .object({
    name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
    email: z.string().email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
    password: z
      .string()
      .min(8, { message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل" })
      .regex(/[A-Z]/, { message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" })
      .regex(/[0-9]/, { message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" }),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(10, { message: "يجب أن يكون رقم الهاتف 10 أرقام على الأقل" }),
    terms: z.literal("on", {
      errorMap: () => ({ message: "يجب الموافقة على الشروط والأحكام" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"], // مسار الخطأ ليكون عند حقل تأكيد كلمة المرور
  })

export async function signup(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = signupSchema.safeParse(data)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const error of parsed.error.errors) {
      errors[error.path[0]] = error.message
    }
    return { errors }
  }

  const { name, email, password, phoneNumber } = parsed.data

  try {
    const response = await authAPI.register({
      fullName: name,
      email,
      password,
      phoneNumber
    })

    if (response.success) {
      // Store token in cookies for server-side access
      // Note: In a real app, you'd use Next.js cookies API
      redirect("/welcome")
    } else {
      return { message: response.error || 'فشل إنشاء الحساب' }
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { message: 'حدث خطأ أثناء إنشاء الحساب' }
  }
}

// --- Login Action ---
const loginSchema = z.object({
  email: z.string().email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
  password: z.string().min(1, { message: "الرجاء إدخال كلمة المرور" }),
})

export async function login(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const error of parsed.error.errors) {
      errors[error.path[0]] = error.message
    }
    return { errors }
  }

  const { email, password } = parsed.data

  try {
    const response = await authAPI.login({ email, password })

    if (response.success) {
      // Store token in cookies for server-side access
      // Note: In a real app, you'd use Next.js cookies API
      redirect("/dashboard")
    } else {
      return { message: response.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { message: 'حدث خطأ أثناء تسجيل الدخول' }
  }
}

// --- Forgot Password Action ---
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
})

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = forgotPasswordSchema.safeParse(data)

  if (!parsed.success) {
    return { errors: { email: parsed.error.errors[0].message } }
  }

  const { email } = parsed.data

  try {
    const response = await authAPI.forgotPassword(email)

    if (response.success) {
      return {
        success: true,
        message: "إذا كان بريدك الإلكتروني مسجل لدينا، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.",
      }
    } else {
      return { message: response.error || 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور' }
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return { message: 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور' }
  }
}

// --- Reset Password Action ---
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل" })
      .regex(/[A-Z]/, { message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" })
      .regex(/[0-9]/, { message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" }),
    confirmPassword: z.string(),
    token: z.string().min(1, { message: "الرمز غير صالح" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  })

export async function resetPassword(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = resetPasswordSchema.safeParse(data)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const error of parsed.error.errors) {
      errors[error.path[0]] = error.message
    }
    return { errors }
  }

  const { password, token } = parsed.data

  try {
    const response = await authAPI.resetPassword(token, password)

    if (response.success) {
      redirect("/login?reset=success")
    } else {
      return { message: response.error || 'الرمز غير صالح أو انتهت صلاحيته' }
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return { message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' }
  }
}
