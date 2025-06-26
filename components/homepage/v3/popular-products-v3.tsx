"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCartIcon, ArrowLeft } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"

const mockProducts = [
  {
    id: "1",
    name: "بطاقة PlayStation Store بقيمة 20$",
    price: "75 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "ألعاب",
  },
  {
    id: "2",
    name: "اشتراك Netflix Premium - شهر",
    price: "40 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "ترفيه",
  },
  {
    id: "3",
    name: "Xbox Game Pass Ultimate - شهر",
    price: "60 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "ألعاب",
  },
  {
    id: "4",
    name: "رصيد Steam بقيمة 10$",
    price: "38 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "ألعاب",
  },
  {
    id: "5",
    name: "اشتراك Spotify Premium - 3 أشهر",
    price: "50 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "موسيقى",
  },
  {
    id: "6",
    name: "بطاقة شحن موبايلي 50 ريال",
    price: "50 ر.س",
    image: "/placeholder.svg?width=300&height=350",
    category: "اتصالات",
  },
]

export default function PopularProductsV3() {
  const handleAddToCart = (productId: string) => {
    console.log(`Product ${productId} added to cart`)
    const currentCount = Number(localStorage.getItem("sadiqCartCount")) || 0
    const newCount = currentCount + 1
    localStorage.setItem("sadiqCartCount", newCount.toString())
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-12">
          <div className="text-center sm:text-right mb-6 sm:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">الأكثر طلباً</h2>
            <p className="mt-2 text-lg text-slate-600">اكتشف المنتجات التي يفضلها عملاؤنا.</p>
          </div>
          <Link href="/store" passHref>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 group rounded-lg h-11 px-6"
            >
              عرض كل المنتجات <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-3px] transition-transform" />
            </Button>
          </Link>
        </div>
        <Carousel opts={{ align: "start", direction: "rtl" }} className="w-full">
          <CarouselContent className="-ml-4">
            {mockProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="group overflow-hidden rounded-xl border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative w-full h-48 bg-slate-100 rounded-t-lg overflow-hidden">
                      <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} />
                      <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full shadow">
                        {product.category}
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="text-md font-semibold text-slate-800 leading-tight h-12 mb-2 overflow-hidden group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-primary">{product.price}</p>
                    </CardContent>
                  </Link>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg h-10"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCartIcon className="h-4 w-4 ml-2" />
                      أضف للسلة
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-10px] sm:left-[-15px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md border border-slate-200 text-slate-700 hover:text-primary transition-colors w-10 h-10 rounded-full disabled:opacity-30" />
          <CarouselNext className="absolute right-[-10px] sm:right-[-15px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md border border-slate-200 text-slate-700 hover:text-primary transition-colors w-10 h-10 rounded-full disabled:opacity-30" />
        </Carousel>
      </div>
    </section>
  )
}
