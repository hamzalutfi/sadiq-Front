"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const categories = ["بطاقات الألعاب", "اشتراكات الترفيه", "برامج وتطبيقات", "اتصالات"]
const platforms = ["PlayStation", "Xbox", "Steam", "Netflix", "Spotify", "Microsoft", "Apple", "Mobily", "STC"]

interface StoreFiltersProps {
  className?: string
}

export default function StoreFilters({ className }: StoreFiltersProps) {
  // In a real app, state would be managed here and lifted up
  return (
    <Card className={`sticky top-24 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle>الفلاتر</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["category", "platform", "price"]} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="font-semibold">الفئة</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id={`cat-${category}`} />
                  <Label htmlFor={`cat-${category}`} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="platform">
            <AccordionTrigger className="font-semibold">المنصة</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id={`plat-${platform}`} />
                  <Label htmlFor={`plat-${platform}`} className="text-sm font-normal">
                    {platform}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold">السعر</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="من" aria-label="الحد الأدنى للسعر" className="h-9" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="إلى" aria-label="الحد الأقصى للسعر" className="h-9" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                تطبيق السعر
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
