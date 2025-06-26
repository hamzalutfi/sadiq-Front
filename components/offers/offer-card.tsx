import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import type { Offer } from "@/lib/offer-data"
import { cn } from "@/lib/utils"

interface OfferCardProps {
  offer: Offer
}

export default function OfferCard({ offer }: OfferCardProps) {
  const BadgeIcon = offer.badgeIcon
  return (
    <Link href={offer.link} passHref>
      <Card className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer border-transparent hover:border-primary/50 bg-white">
        <div className="relative w-full h-32 bg-slate-100 rounded-t-lg overflow-hidden">
          <Image src={offer.image} alt={offer.title} fill style={{ objectFit: "cover" }} />
        </div>
        <CardContent className="p-5 flex-grow flex flex-col">
          <p className="text-xs font-medium text-primary mb-1">{offer.category}</p>
          <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">
            {offer.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3 flex-grow">{offer.description}</p>
          <div className="mt-auto space-y-2">
            <div
              className={cn(
                "inline-block px-4 py-2 rounded-md text-white font-bold text-md shadow",
                offer.themeColor || "bg-primary",
              )}
            >
              {offer.discountText}
            </div>
            {offer.validUntil && (
              <div className="flex items-center text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5 ml-1" />
                <span>{offer.validUntil}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-slate-50 border-t border-slate-200">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary-dark hover:bg-primary/10 group-hover:translate-x-[-2px] transition-transform duration-200 font-semibold"
          >
            اكتشف العرض <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
