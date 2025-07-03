"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          {/* <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sadiq Logo"
              width={120}
              height={48}
              className="h-10 w-auto"
            />
          </Link> */}
          <span className="text-sm text-slate-600" >متجر صديق - الأفضل للمنتجات الرقمية</span>
        </div>
      </header>
      <main className="container py-12 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Image
            src="/logo.png"
            alt="Sadiq Store Logo"
            width={100}
            height={40}
            className="mx-auto mb-6 h-12 w-auto"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-4 p-10  ">من نحن؟</h1>
          <p className="text-lg text-slate-700 mb-6">
            متجر <span className="font-semibold text-primary">صديق</span> هو وجهتك الأولى لشراء المنتجات الرقمية بأمان وسهولة. نؤمن بأن التسوق الرقمي يجب أن يكون بسيطًا، سريعًا، وموثوقًا للجميع. نقدم مجموعة واسعة من بطاقات الألعاب، الاشتراكات الترفيهية، البرامج، والمزيد، مع تسليم فوري وخدمة عملاء مميزة.
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2 p-7">رسالتنا</h2>
          <p className="text-slate-600 mb-6">
            توفير تجربة تسوق رقمية آمنة وموثوقة تلبي احتياجات جميع عملائنا، مع التركيز على الجودة، السرعة، والدعم المستمر.
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2 p-7">لماذا نحن؟</h2>
          <ul className="text-slate-600 mb-6 list-disc list-inside text-right">
            <li>تسليم فوري وآمن للأكواد الرقمية</li>
            <li>دعم فني متواصل وسريع الاستجابة</li>
            <li>تشكيلة واسعة من المنتجات الرقمية الأصلية</li>
            <li>أسعار تنافسية وعروض حصرية</li>
          </ul>
          <p className="text-slate-700">شكراً لثقتكم بنا. نسعى دائماً لتقديم الأفضل!</p>
        </div>
      </main>
    </div>
  );
}
