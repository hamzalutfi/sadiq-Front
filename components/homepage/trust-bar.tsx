import { Rocket, ShieldCheck, Headphones, Award } from "lucide-react"

const trustFeatures = [
  { icon: Rocket, text: "تسليم فوري للأكواد" },
  { icon: ShieldCheck, text: "دفع آمن 100%" },
  { icon: Headphones, text: "دعم فني متواصل" },
  { icon: Award, text: "منتجات أصلية ومضمونة" },
]

export default function TrustBar() {
  return (
    <section className="bg-slate-100 border-y border-slate-200">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-center">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center sm:flex-row sm:text-right sm:space-x-reverse sm:space-x-3"
            >
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <feature.icon className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
