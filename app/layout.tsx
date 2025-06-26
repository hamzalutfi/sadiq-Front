import type React from "react"
import type { Metadata } from "next"
import { Tajawal } from "next/font/google" // Using Tajawal for better Arabic support
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { OrdersProvider } from "@/contexts/orders-context"
import { AdminProvider } from "@/contexts/admin-context"
import { ProductsProvider } from "@/contexts/products-context"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const tajawalFont = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "صديق | بطاقات رقمية واشتراكات فورية",
  description: "متجرك الموثوق للبطاقات الرقمية، اشتراكات الألعاب، خدمات البث، والبرامج. تسليم فوري وآمن.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-white font-sans antialiased", tajawalFont.variable)}
        style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <OrdersProvider>
              <AdminProvider>
                <ProductsProvider>
                  <CartProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                  </CartProvider>
                </ProductsProvider>
              </AdminProvider>
            </OrdersProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
