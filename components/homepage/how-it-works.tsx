import { MousePointerIcon as MousePointerSquare, CreditCardIcon, KeyRound } from "lucide-react"

const steps = [
  { icon: MousePointerSquare, title: "اختر منتجك", description: "تصفح مجموعتنا الواسعة واختر ما يناسبك بسهولة." },
  { icon: CreditCardIcon, title: "ادفع بأمان", description: "عمليات دفع آمنة وموثوقة عبر بوابات متعددة." },
  { icon: KeyRound, title: "استلم كودك فوراً", description: "يصلك الكود مباشرة بعد إتمام عملية الدفع." },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">ثلاث خطوات بسيطة لتحصل على اشتراكك</h2>
          <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">تجربة شراء سهلة وسريعة، مصممة لراحتك.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-6 md:p-8 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold shadow-md">
                {index + 1}
              </div>
              <div className="bg-primary/10 p-4 rounded-full my-6">
                <step.icon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-slate-800">{step.title}</h3>
              <p className="text-slate-600 text-sm md:text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
