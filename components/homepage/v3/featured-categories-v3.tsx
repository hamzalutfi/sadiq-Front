import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Clapperboard, AppWindow, Sparkles } from "lucide-react"
import Image from "next/image"

const categories = [
  {
    name: "بطاقات الألعاب",
    description: "اشحن ألعابك المفضلة بسهولة.",
    href: "/categories/gaming",
    icon: Gamepad2,
    image: "/placeholder.svg?width=400&height=250",
    bgColor: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    name: "اشتراكات الترفيه",
    description: "أفلام، مسلسلات، وموسيقى بلا حدود.",
    href: "/categories/streaming",
    icon: Clapperboard,
    image: "/placeholder.svg?width=400&height=250",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    name: "برامج وتطبيقات",
    description: "أدوات إنتاجية وحماية لجهازك.",
    href: "/categories/software",
    icon: AppWindow,
    image: "/placeholder.svg?width=400&height=250",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    name: "عروض حصرية",
    description: "لا تفوت أفضل التخفيضات لدينا.",
    href: "/offers",
    icon: Sparkles,
    image: "/placeholder.svg?width=400&height=250",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
]

export default function FeaturedCategoriesV3() {
  return (
    <section id="categories" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">اكتشف عالمك الرقمي</h2>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">كل ما تحتاجه من بطاقات واشتراكات في مكان واحد.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} passHref>
              <Card
                className={`group overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer ${category.bgColor}`}
              >
                <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                  <Image src={category.image} alt={category.name} fill style={{ objectFit: "cover" }} />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col items-start">
                  <category.icon className={`h-8 w-8 mb-3 ${category.iconColor}`} />
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-600 flex-grow">{category.description}</p>
                  <span className={`mt-4 text-sm font-semibold ${category.iconColor} group-hover:underline`}>
                    تصفح الآن &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
