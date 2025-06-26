import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-slate-50 pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        {/* Optional: Subtle background pattern or abstract shapes */}
        {/* <Image src="/placeholder.svg" layout="fill" objectFit="cover" alt="Background pattern" /> */}
      </div>
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
          اشتراكاتك الرقمية، <span className="text-primary">فوراً</span> بين يديك.
        </h1>
        <p className="mt-6 max-w-xl md:max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
          بطاقات ألعاب، اشتراكات بث، وبرامج. تسليم فوري وآمن لتستمتع بلا حدود.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/store" passHref>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white px-10 py-3 h-14 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              اكتشف المنتجات الآن
            </Button>
          </Link>
          <Link href="/how-it-works" passHref>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-3 h-14 text-lg font-semibold rounded-lg border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
            >
              كيف يعمل؟
            </Button>
          </Link>
        </div>
      </div>
      {/* Decorative shapes - optional */}
      <div className="absolute -bottom-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full opacity-50 blur-2xl animate-pulse" />
      <div className="absolute -top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full opacity-30 blur-2xl animate-pulse animation-delay-2000" />
    </section>
  )
}
