import type { LucideIcon } from "lucide-react"
import { Tag, Percent, Zap, Gift } from "lucide-react"

export interface Offer {
  id: string
  title: string
  description: string
  image: string
  discountText: string // e.g., "خصم 20%", "وفر 50 ر.س", "عرض خاص"
  category: string
  validUntil?: string // e.g., "ينتهي في 30 يونيو"
  link: string
  badgeText?: string
  badgeIcon?: LucideIcon
  themeColor?: string // Tailwind color class for badge/accents e.g., "bg-primary", "bg-amber-500"
}

export const mockOffers: Offer[] = [
  {
    id: "offer_001",
    title: "خصم 25% على جميع بطاقات PlayStation",
    description: "اشحن رصيدك الآن واحصل على خصم فوري على جميع بطاقات PlayStation الأمريكية والسعودية.",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "خصم 25%",
    category: "بطاقات الألعاب",
    validUntil: "ينتهي في 15 يوليو",
    link: "/store?category=gaming-cards&platform=playstation",
    badgeText: "حصري",
    badgeIcon: Tag,
    themeColor: "bg-sky-600",
  },
  {
    id: "offer_002",
    title: "اشتراك Netflix مجاني مع بطاقة Steam بقيمة 50$",
    description: "احصل على شهر مجاني من Netflix عند شرائك بطاقة Steam بقيمة 50 دولارًا أو أكثر.",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "هدية مجانية",
    category: "باقات وعروض",
    link: "/product/prod_302", // Assuming prod_302 is Steam $50 card
    badgeText: "عرض محدود",
    badgeIcon: Gift,
    themeColor: "bg-rose-600",
  },
  {
    id: "offer_003",
    title: "وفر 30 ر.س على اشتراكات Shahid VIP السنوية",
    description: "استمتع بأفضل المسلسلات والأفلام العربية مع خصم خاص على الباقة السنوية من شاهد.",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "وفر 30 ر.س",
    category: "اشتراكات الترفيه",
    validUntil: "ينتهي في 25 يوليو",
    link: "/store?category=streaming-subscriptions&platform=shahid",
    badgeIcon: Percent,
    themeColor: "bg-emerald-600",
  },
  {
    id: "offer_004",
    title: "عروض الصيف: تخفيضات تصل إلى 50% على برامج مختارة",
    description: "حدث جهازك بأفضل برامج الحماية والإنتاجية بأسعار لا تقاوم.",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "حتى 50% خصم",
    category: "برامج وتطبيقات",
    link: "/store?category=software-apps",
    badgeText: "تخفيضات الصيف",
    badgeIcon: Zap,
    themeColor: "bg-amber-500",
  },
  {
    id: "offer_005",
    title: "بطاقة Xbox Game Pass Ultimate + لعبة مجانية",
    description: "احصل على لعبة رقمية مجانية عند شرائك اشتراك Xbox Game Pass Ultimate لمدة 3 أشهر.",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "لعبة مجانية",
    category: "بطاقات الألعاب",
    validUntil: "ينتهي في 10 أغسطس",
    link: "/store?platform=xbox",
    badgeText: "صفقة رائعة",
    badgeIcon: Gift,
    themeColor: "bg-lime-600",
  },
  {
    id: "offer_006",
    title: "اشحن موبايلي واحصل على بيانات إضافية",
    description: "عروض شحن خاصة لعملاء موبايلي. بيانات أكثر بنفس السعر!",
    image: "/placeholder.svg?width=500&height=300",
    discountText: "بيانات إضافية",
    category: "اتصالات",
    link: "/store?platform=mobily",
    badgeIcon: Zap,
    themeColor: "bg-violet-600",
  },
]
