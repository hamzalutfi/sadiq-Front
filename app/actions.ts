"use server"

import { z } from "zod"
import { redirect } from "next/navigation"

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

  const { name, email, password } = parsed.data

  // --- منطق التعامل مع قاعدة البيانات ---
  // 1. التحقق مما إذا كان البريد الإلكتروني مسجلاً مسبقاً
  // مثال: const existingUser = await db.user.findUnique({ where: { email } });
  // if (existingUser) {
  //   return { message: 'هذا البريد الإلكتروني مسجل بالفعل' };
  // }

  // 2. تشفير كلمة المرور (مهم جداً للأمان)
  // استخدم مكتبة مثل bcrypt
  // const hashedPassword = await bcrypt.hash(password, 10);

  // 3. إنشاء المستخدم في قاعدة البيانات
  // await db.user.create({
  //   data: {
  //     name,
  //     email,
  //     password: hashedPassword,
  //   },
  // });
  // ------------------------------------

  // محاكاة للنجاح
  console.log("User created successfully:", { name, email })

  // بعد النجاح، قم بتوجيه المستخدم
  redirect("/welcome") // أو إلى صفحة تفعيل الحساب
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

  // --- منطق التعامل مع قاعدة البيانات ---
  // 1. البحث عن المستخدم عبر البريد الإلكتروني
  // const user = await db.user.findUnique({ where: { email } });
  // if (!user) {
  //   return { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  // }
  // 2. مقارنة كلمة المرور المشفرة
  // const passwordMatch = await bcrypt.compare(password, user.password);
  // if (!passwordMatch) {
  //   return { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  // }
  // 3. إنشاء جلسة أو Token
  // ...
  // ------------------------------------

  // محاكاة للنجاح
  console.log("User logged in successfully:", { email })
  redirect("/dashboard") // توجيه إلى لوحة التحكم أو الصفحة الرئيسية
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

  // --- منطق التعامل مع قاعدة البيانات ---
  // 1. تحقق من وجود المستخدم
  // const user = await db.user.findUnique({ where: { email } });
  // if (user) {
  //   // 2. إنشاء رمز تحقق فريد ومؤقت
  //   const token = crypto.randomBytes(32).toString("hex");
  //   const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق
  //   // await db.passwordResetToken.create({ data: { email, token, expires } });
  //   // 3. إرسال البريد الإلكتروني
  //   // await sendPasswordResetEmail(email, token);
  // }
  // ------------------------------------

  // لأسباب أمنية، نعرض دائماً رسالة نجاح
  return {
    success: true,
    message: "إذا كان بريدك الإلكتروني مسجلاً لدينا، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.",
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

  // --- منطق التعامل مع قاعدة البيانات ---
  // 1. البحث عن الرمز في قاعدة البيانات
  // const savedToken = await db.passwordResetToken.findUnique({ where: { token } });
  // if (!savedToken || savedToken.expires < new Date()) {
  //   return { message: "الرمز غير صالح أو انتهت صلاحيته." };
  // }
  // 2. تشفير كلمة المرور الجديدة
  // const hashedPassword = await bcrypt.hash(password, 10);
  // 3. تحديث كلمة مرور المستخدم
  // await db.user.update({ where: { email: savedToken.email }, data: { password: hashedPassword } });
  // 4. حذف الرمز المستخدم
  // await db.passwordResetToken.delete({ where: { token } });
  // ------------------------------------

  // توجيه إلى صفحة تسجيل الدخول مع رسالة نجاح
  redirect("/login?reset=success")
}
