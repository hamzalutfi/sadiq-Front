import type { LucideIcon } from "lucide-react"
import { Gamepad2, Clapperboard, AppWindow, Smartphone, Tv, Headphones, ShieldCheck } from "lucide-react"

export interface CategoryInfo {
  slug: string
  name: string
  description: string
  image: string // URL for a representative image
  icon: LucideIcon
  itemCount?: number // Optional: number of products in this category
  gradientColors: { from: string; to: string }
}

export const storeCategories: CategoryInfo[] = [
  {
    slug: "gaming-cards",
    name: "بطاقات الألعاب",
    description: "اشحن ألعابك المفضلة، احصل على إضافات حصرية، واكتشف عوالم جديدة.",
    image: "/placeholder.svg?width=500&height=300",
    icon: Gamepad2,
    itemCount: 250, // Example count
    gradientColors: { from: "from-sky-500", to: "to-blue-600" },
  },
  {
    slug: "streaming-subscriptions",
    name: "اشتراكات الترفيه",
    description: "أفلام، مسلسلات، موسيقى، وبودكاست بلا حدود. متع حواسك بأفضل المحتوى.",
    image: "/placeholder.svg?width=500&height=300",
    icon: Clapperboard,
    itemCount: 180,
    gradientColors: { from: "from-rose-500", to: "to-red-600" },
  },
  {
    slug: "software-apps",
    name: "برامج وتطبيقات",
    description: "أدوات إنتاجية، برامج حماية، وتطبيقات إبداعية لتعزيز تجربتك الرقمية.",
    image: "/placeholder.svg?width=500&height=300",
    icon: AppWindow,
    itemCount: 120,
    gradientColors: { from: "from-amber-500", to: "to-orange-600" },
  },
  {
    slug: "telecom-recharge",
    name: "اتصالات وشحن رصيد",
    description: "بطاقات شحن لجميع الشبكات، وبيانات انترنت لتظل متصلاً دائماً.",
    image: "/placeholder.svg?width=500&height=300",
    icon: Smartphone,
    itemCount: 90,
    gradientColors: { from: "from-emerald-500", to: "to-green-600" },
  },
  {
    slug: "tv-subscriptions",
    name: "اشتراكات التلفزيون",
    description: "باقات رياضية، قنوات أفلام، وبرامج وثائقية لجميع أفراد العائلة.",
    image: "/placeholder.svg?width=500&height=300",
    icon: Tv,
    itemCount: 75,
    gradientColors: { from: "from-purple-500", to: "to-indigo-600" },
  },
  {
    slug: "music-audio",
    name: "موسيقى وصوتيات",
    description: "استمتع بملايين الأغاني والبودكاست بجودة عالية وبدون إعلانات.",
    image: "/placeholder.svg?width=500&height=300",
    icon: Headphones,
    itemCount: 60,
    gradientColors: { from: "from-pink-500", to: "to-fuchsia-600" },
  },
  {
    slug: "security-privacy",
    name: "حماية وخصوصية",
    description: "برامج مكافحة فيروسات وخدمات VPN لتأمين بياناتك وتصفح آمن.",
    image: "/placeholder.svg?width=500&height=300",
    icon: ShieldCheck,
    itemCount: 40,
    gradientColors: { from: "from-slate-500", to: "to-gray-600" },
  },
]
