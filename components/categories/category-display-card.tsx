import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { CategoryInfo } from "@/lib/category-data"
import { cn } from "@/lib/utils"

interface CategoryDisplayCardProps {
  category: CategoryInfo
}

export default function CategoryDisplayCard({ category }: CategoryDisplayCardProps) {
  const IconComponent = category.icon
  return (
    <Link href={`/store?category=${category.slug}`} passHref>
      <Card className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer border-transparent hover:border-primary/30">
        <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
          <Image src={category.image} alt={category.name} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="relative w-full h-48 md:h-56">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t opacity-70 group-hover:opacity-80 transition-opacity duration-300",
              category.gradientColors.from,
              category.gradientColors.to,
            )}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <IconComponent className="h-12 w-12 md:h-16 md:w-16 text-white mb-3 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{category.name}</h2>
          </div>
        </div>
        <CardContent className="p-6 flex-grow flex flex-col bg-white">
          <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">{category.description}</p>
          {category.itemCount && (
            <p className="text-xs text-slate-500 mb-4">{category.itemCount.toLocaleString("ar-SA")} منتج متوفر</p>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-slate-50 border-t">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary-dark hover:bg-primary/10 group-hover:translate-x-[-2px] transition-transform duration-200"
          >
            تسوق الآن <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
