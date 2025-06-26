import CategoryDisplayCard from "@/components/categories/category-display-card"
import { storeCategories } from "@/lib/category-data"

export default function CategoriesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">تصفح جميع الفئات</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            اكتشف مجموعتنا المتنوعة من البطاقات الرقمية والاشتراكات. كل ما تحتاجه وأكثر في متناول يدك.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {storeCategories.map((category) => (
            <CategoryDisplayCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
