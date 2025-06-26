import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Clapperboard, AppWindow, ShoppingBag } from "lucide-react"
import Image from "next/image"

const categories = [
  {
    name: "بطاقات الألعاب",
    href: "/categories/gaming",
    icon: Gamepad2,
    image: "/placeholder.svg?width=400&height=300",
  },
  {
    name: "اشتراكات الترفيه",
    href: "/categories/streaming",
    icon: Clapperboard,
    image: "/placeholder.svg?width=400&height=300",
  },
  {
    name: "برامج وتطبيقات",
    href: "/categories/software",
    icon: AppWindow,
    image: "/placeholder.svg?width=400&height=300",
  },
  { name: "كل المنتجات", href: "/store", icon: ShoppingBag, image: "/placeholder.svg?width=400&height=300" },
]

export default function ProductCategories() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">تصفح حسب اهتمامك</h2>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
            اكتشف مجموعتنا المتنوعة من البطاقات الرقمية والاشتراكات.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} passHref>
              <Card className="group overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                  <Image src={category.image} alt={category.name} fill style={{ objectFit: "cover" }} />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col items-center text-center justify-center">
                  <category.icon className="h-10 w-10 text-primary mb-3 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
