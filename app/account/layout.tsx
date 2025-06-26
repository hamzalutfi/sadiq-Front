"use client"

import type React from "react"
import Link from "next/link"
import { User, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation" // Corrected import for usePathname

// Client component to use usePathname
function AccountSidebarNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/account/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/account/profile", label: "الملف الشخصي", icon: User },
    { href: "/account/orders", label: "طلباتي", icon: ShoppingBag },
    // Add more links like Addresses, Payment Methods, etc.
  ]

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">حسابي</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-md text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors font-medium",
                pathname === item.href ? "bg-primary/10 text-primary" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            href="/login" // Or a logout action
            className="flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-md text-slate-600 hover:bg-red-500/10 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebarNavigation />
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </div>
  )
}
