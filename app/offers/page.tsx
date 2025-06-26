import OfferCard from "@/components/offers/offer-card"
import { mockOffers } from "@/lib/offer-data"
import { Gift } from "lucide-react"

export default function OffersPage() {
  return (
    <div className="bg-gradient-to-b from-primary/5 via-slate-50 to-slate-100 min-h-screen">
      <div className="container py-12 md:py-20">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Gift className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            عروض <span className="text-primary">صديق</span> الحصرية
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            لا تفوت أقوى التخفيضات والصفقات المذهلة على بطاقات الألعاب، الاشتراكات، والبرامج. تسوق بذكاء ووفر أكثر!
          </p>
        </header>

        {mockOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gift className="h-24 w-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">لا توجد عروض حالياً</h2>
            <p className="text-slate-500">يرجى التحقق مرة أخرى قريباً للحصول على أحدث الصفقات.</p>
          </div>
        )}

        {/* Optional: Add a section for newsletter signup for offers */}
      </div>
    </div>
  )
}
