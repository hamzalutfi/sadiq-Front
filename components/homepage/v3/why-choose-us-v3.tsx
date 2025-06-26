import { Rocket, ShieldCheck, Headphones, CheckCircle } from "lucide-react"

const benefits = [
  {
    icon: Rocket,
    title: "تسليم فوري",
    description: "استلم أكوادك فوراً بعد إتمام عملية الدفع مباشرة على بريدك الإلكتروني.",
  },
  {
    icon: ShieldCheck,
    title: "دفع آمن وموثوق",
    description: "نستخدم أحدث تقنيات التشفير لحماية جميع معاملاتك وبياناتك الشخصية.",
  },
  {
    icon: Headphones,
    title: "دعم فني متميز",
    description: "فريق دعم العملاء لدينا جاهز لمساعدتك والإجابة على استفساراتك بسرعة وكفاءة.",
  },
  {
    icon: CheckCircle,
    title: "منتجات أصلية 100%",
    description: "جميع البطاقات والاشتراكات التي نقدمها أصلية ومضمونة من مصادر موثوقة.",
  },
]

export default function WhyChooseUsV3() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">لماذا تختار متجر صديق؟</h2>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
            نحن نسعى لتقديم أفضل تجربة تسوق للبطاقات الرقمية والاشتراكات.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
