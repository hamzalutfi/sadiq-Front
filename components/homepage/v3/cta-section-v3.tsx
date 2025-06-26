import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function CallToActionV3() {
  return (
    <section className="py-16 md:py-24 bg-primary-dark text-white">
      <div className="container text-center">
        <Mail className="h-16 w-16 text-primary-foreground/50 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">لا تفوت عروضنا الحصرية!</h2>
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
          اشترك في قائمتنا البريدية ليصلك كل جديد وأقوى العروض مباشرة إلى بريدك الإلكتروني.
        </p>
        <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            className="h-12 rounded-lg text-slate-900 placeholder:text-slate-500 flex-grow"
            aria-label="البريد الإلكتروني للاشتراك"
          />
          <Button
            type="submit"
            size="lg"
            className="bg-white text-primary hover:bg-slate-100 h-12 rounded-lg font-semibold shadow-md"
          >
            اشترك الآن
          </Button>
        </form>
        <p className="text-xs text-primary-foreground/60 mt-4">
          نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت. اقرأ{" "}
          <Link href="/privacy-policy" className="underline hover:text-white">
            سياسة الخصوصية
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
