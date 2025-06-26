import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 mb-10">
          {/* Column 1: Logo and Bio */}
          <div className="space-y-4 xl:col-span-2">
            <Link href="/" className="inline-block mb-2">
              <Image src="/logo.png" alt="Sadiq Logo" width={140} height={60} className="brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              صديق - متجرك الأول للبطاقات الرقمية والاشتراكات. نقدم لك أفضل العروض مع تسليم فوري وآمن، وخدمة عملاء
              متميزة.
            </p>
            <div className="flex space-x-4 space-x-reverse pt-2">
              <Link href="#" aria-label="Facebook" className="text-slate-500 hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-slate-500 hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-slate-500 hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" aria-label="YouTube" className="text-slate-500 hover:text-primary transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-5 uppercase tracking-wider">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/store" className="hover:text-primary transition-colors">
                  المتجر
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary transition-colors">
                  الفئات
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-primary transition-colors">
                  العروض الحصرية
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-5 uppercase tracking-wider">دعم العملاء</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h3 className="text-md font-semibold text-slate-200 mb-5 uppercase tracking-wider">وسائل الدفع</h3>
            <div className="flex flex-wrap gap-2">
              {["Visa", "Mastercard", "Apple Pay", "Mada", "STC Pay"].map((method) => (
                <div key={method} className="bg-slate-700 p-2 rounded-md flex items-center justify-center h-10 w-16">
                  <Image
                    src={`/placeholder.svg?width=40&height=25&query=${method}+logo&theme=dark`}
                    alt={method}
                    width={40}
                    height={25}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 text-slate-500">جميع المعاملات آمنة ومشفرة.</p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} صديق. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
