"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { getCartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navLinks = [
    { href: "/store", label: "المتجر" },
    { href: "/categories", label: "الفئات" },
    { href: "/offers", label: "العروض" },
    { href: "/about", label: "من نحن" },
  ]

  const cartItemCount = getCartCount()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-transparent pt-2 md:pt-4",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.png" alt="Sadiq Logo" width={120} height={50} priority className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center space-x-8 space-x-reverse text-base font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 transition-colors hover:text-primary pb-1 border-b-2 border-transparent hover:border-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            aria-label="بحث"
            className="text-slate-600 hover:text-primary hidden sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart" passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="عربة التسوق"
              className="relative text-slate-600 hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="حساب المستخدم"
                  className="text-slate-600 hover:text-primary"
                >
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/dashboard" className="cursor-pointer">
                    <User className="h-4 w-4 ml-2" />
                    لوحة التحكم
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/profile" className="cursor-pointer">
                    <User className="h-4 w-4 ml-2" />
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders" className="cursor-pointer">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    طلباتي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" passHref>
              <Button
                variant="ghost"
                size="icon"
                aria-label="تسجيل الدخول"
                className="text-slate-600 hover:text-primary"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="فتح القائمة"
              className="text-slate-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white shadow-xl absolute w-full left-0">
          <nav className="flex flex-col space-y-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 transition-colors hover:text-primary hover:bg-slate-100 rounded-md px-3 py-3 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              aria-label="بحث"
              className="text-slate-600 hover:text-primary justify-start px-3 py-3 sm:hidden"
            >
              <Search className="h-5 w-5 ml-2" /> بحث
            </Button>
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 border-t border-slate-200 mt-2">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-slate-500 text-xs">{user?.email}</p>
                </div>
                <Link
                  href="/account/dashboard"
                  className="text-slate-700 transition-colors hover:text-primary hover:bg-slate-100 rounded-md px-3 py-3 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/account/profile"
                  className="text-slate-700 transition-colors hover:text-primary hover:bg-slate-100 rounded-md px-3 py-3 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الملف الشخصي
                </Link>
                <Link
                  href="/account/orders"
                  className="text-slate-700 transition-colors hover:text-primary hover:bg-slate-100 rounded-md px-3 py-3 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  طلباتي
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start px-3 py-3"
                >
                  <LogOut className="h-5 w-5 ml-2" /> تسجيل الخروج
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-slate-700 transition-colors hover:text-primary hover:bg-slate-100 rounded-md px-3 py-3 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
