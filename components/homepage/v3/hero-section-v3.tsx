import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSectionV3() {
  return (
    <section className="bg-gradient-to-b from-primary/5 via-white to-white pt-20 md:pt-28 pb-16 md:pb-24">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-right">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            اشتراكاتك الرقمية.
            <br />
            <span className="text-primary">فوراً وموثوقة.</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg md:text-xl text-slate-600">
            متجر صديق يوفر لك أسهل طريقة للحصول على بطاقات الألعاب، اشتراكات
            الترفيه، والبرامج. تسوق بثقة واستمتع فوراً!
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/store" passHref>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white px-10 h-14 text-lg font-semibold rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 w-full sm:w-auto"
              >
                تصفح المنتجات
              </Button>
            </Link>
            <Link href="#categories" passHref>
              <Button
                size="lg"
                variant="outline"
                className="px-10 h-14 text-lg font-semibold rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-primary hover:text-primary w-full sm:w-auto"
              >
                اكتشف الفئات
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <Image
            src="/Image_fx (2).jpg"
            alt="بطاقات رقمية متنوعة"
            width={600}
            height={500}
            className="rounded-xl shadow-2xl object-cover"
            priority
          />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary/5 rounded-lg blur-lg animate-pulse animation-delay-2000" />
        </div>
      </div>
    </section>
  );
}
