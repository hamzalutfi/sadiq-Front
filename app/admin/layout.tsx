"use client"

import type React from "react"
import { Home, ShoppingCart, Users, Package, BarChart3, CreditCard, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/contexts/admin-context"
import AdminProtectedRoute from "@/components/auth/admin-protected-route"

const navItems = [
  { href: "/admin/dashboard", label: "اللوحة الرئيسية", icon: Home },
  { href: "/admin/orders", label: "إدارة الطلبات", icon: ShoppingCart },
  { href: "/admin/users", label: "إدارة المستخدمين", icon: Users },
  { href: "/admin/products", label: "إدارة المنتجات", icon: Package },
  { href: "/admin/reports", label: "التقارير والإحصائيات", icon: BarChart3 },
  { href: "/admin/transactions", label: "سجل المدفوعات", icon: CreditCard },
]

function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300">
      <div className="h-20 flex items-center px-6 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Sadiq Logo" width={100} height={40} className="brightness-0 invert" />
          <span className="text-sm font-semibold text-slate-500">Admin</span>
        </Link>
      </div>
      <nav className="flex-grow px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>العودة للموقع</span>
        </Link>
      </div>
    </aside>
  )
}

function AdminHeader() {
  const { adminUser } = useAdmin()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900">لوحة الإدارة</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
            <Image
              src="/placeholder.svg?width=32&height=32"
              width={32}
              height={32}
              className="rounded-full"
              alt="Admin Avatar"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{adminUser?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{adminUser?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            الإعدادات
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen w-full bg-slate-100" dir="rtl">
        <AdminSidebar />
        <div className="flex flex-col flex-grow">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
