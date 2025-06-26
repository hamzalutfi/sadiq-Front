export interface StoreProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: "بطاقات الألعاب" | "اشتراكات الترفيه" | "برامج وتطبيقات" | "اتصالات"
  platform:
    | "PlayStation"
    | "Xbox"
    | "Steam"
    | "Netflix"
    | "Spotify"
    | "Shahid"
    | "Microsoft"
    | "Apple"
    | "Google Play"
    | "Mobily"
    | "STC"
  tags: string[]
  rating: number
  isNew: boolean
}

export const mockStoreProducts: StoreProduct[] = [
  // PlayStation
  {
    id: "prod_101",
    name: "بطاقة PlayStation Store بقيمة 20$ (أمريكي)",
    image: "/placeholder.svg?width=300&height=400",
    price: 75,
    category: "بطاقات الألعاب",
    platform: "PlayStation",
    tags: ["PSN", "أمريكي"],
    rating: 4.8,
    isNew: false,
  },
  {
    id: "prod_102",
    name: "بطاقة PlayStation Store بقيمة 50$ (أمريكي)",
    image: "/placeholder.svg?width=300&height=400",
    price: 180,
    originalPrice: 190,
    category: "بطاقات الألعاب",
    platform: "PlayStation",
    tags: ["PSN", "أمريكي"],
    rating: 4.9,
    isNew: true,
  },
  {
    id: "prod_103",
    name: "اشتراك PlayStation Plus Essential (شهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 35,
    category: "بطاقات الألعاب",
    platform: "PlayStation",
    tags: ["Plus", "Essential"],
    rating: 4.7,
    isNew: false,
  },
  {
    id: "prod_104",
    name: "اشتراك PlayStation Plus Extra (3 أشهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 150,
    category: "بطاقات الألعاب",
    platform: "PlayStation",
    tags: ["Plus", "Extra"],
    rating: 4.8,
    isNew: false,
  },

  // Xbox
  {
    id: "prod_201",
    name: "Xbox Game Pass Ultimate (شهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 60,
    category: "بطاقات الألعاب",
    platform: "Xbox",
    tags: ["Game Pass", "Ultimate"],
    rating: 4.9,
    isNew: false,
  },
  {
    id: "prod_202",
    name: "بطاقة هدايا Xbox بقيمة 25$",
    image: "/placeholder.svg?width=300&height=400",
    price: 95,
    category: "بطاقات الألعاب",
    platform: "Xbox",
    tags: ["رصيد", "هدايا"],
    rating: 4.6,
    isNew: false,
  },

  // Steam
  {
    id: "prod_301",
    name: "رصيد Steam بقيمة 10$ (عالمي)",
    image: "/placeholder.svg?width=300&height=400",
    price: 38,
    category: "بطاقات الألعاب",
    platform: "Steam",
    tags: ["PC", "عالمي"],
    rating: 4.8,
    isNew: false,
  },
  {
    id: "prod_302",
    name: "رصيد Steam بقيمة 20$ (عالمي)",
    image: "/placeholder.svg?width=300&height=400",
    price: 75,
    category: "بطاقات الألعاب",
    platform: "Steam",
    tags: ["PC", "عالمي"],
    rating: 4.8,
    isNew: true,
  },

  // Streaming
  {
    id: "prod_401",
    name: "اشتراك Netflix Premium (شهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 45,
    category: "اشتراكات الترفيه",
    platform: "Netflix",
    tags: ["أفلام", "مسلسلات"],
    rating: 4.7,
    isNew: false,
  },
  {
    id: "prod_402",
    name: "اشتراك Spotify Premium (3 أشهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 50,
    category: "اشتراكات الترفيه",
    platform: "Spotify",
    tags: ["موسيقى", "بودكاست"],
    rating: 4.6,
    isNew: false,
  },
  {
    id: "prod_403",
    name: "اشتراك Shahid VIP (شهر)",
    image: "/placeholder.svg?width=300&height=400",
    price: 30,
    category: "اشتراكات الترفيه",
    platform: "Shahid",
    tags: ["عربي", "مسلسلات"],
    rating: 4.5,
    isNew: false,
  },

  // Software & Others
  {
    id: "prod_501",
    name: "مفتاح تفعيل Windows 11 Pro",
    image: "/placeholder.svg?width=300&height=400",
    price: 150,
    category: "برامج وتطبيقات",
    platform: "Microsoft",
    tags: ["نظام تشغيل", "أصلي"],
    rating: 4.9,
    isNew: true,
  },
  {
    id: "prod_502",
    name: "بطاقة هدايا iTunes بقيمة 15$",
    image: "/placeholder.svg?width=300&height=400",
    price: 60,
    category: "برامج وتطبيقات",
    platform: "Apple",
    tags: ["App Store", "Music"],
    rating: 4.7,
    isNew: false,
  },
  {
    id: "prod_503",
    name: "بطاقة Google Play بقيمة 10$ (أمريكي)",
    image: "/placeholder.svg?width=300&height=400",
    price: 40,
    category: "برامج وتطبيقات",
    platform: "Google Play",
    tags: ["Android", "تطبيقات"],
    rating: 4.6,
    isNew: false,
  },

  // Telecom
  {
    id: "prod_601",
    name: "بطاقة شحن موبايلي 50 ريال",
    image: "/placeholder.svg?width=300&height=400",
    price: 50,
    category: "اتصالات",
    platform: "Mobily",
    tags: ["شحن", "رصيد"],
    rating: 4.9,
    isNew: false,
  },
  {
    id: "prod_602",
    name: "بطاقة شحن STC سوا 100 ريال",
    image: "/placeholder.svg?width=300&height=400",
    price: 100,
    originalPrice: 115,
    category: "اتصالات",
    platform: "STC",
    tags: ["شحن", "سوا"],
    rating: 4.9,
    isNew: false,
  },
]
