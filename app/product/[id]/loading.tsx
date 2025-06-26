export default function LoadingProductPage() {
  return (
    <div className="container py-8 md:py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="bg-slate-200 rounded-lg aspect-[4/5]"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-slate-200 rounded-md aspect-square"></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-2/5 bg-slate-200 rounded"></div> {/* Brand Logo */}
          <div className="h-10 w-4/5 bg-slate-200 rounded"></div> {/* Title */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="h-6 w-1/4 bg-slate-200 rounded"></div> {/* Rating */}
            <div className="h-6 w-1/3 bg-slate-200 rounded"></div> {/* Tags */}
          </div>
          <div className="h-16 w-full bg-slate-200 rounded"></div> {/* Short Description */}
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
            <div className="h-10 w-1/3 bg-slate-200 rounded mb-2"></div> {/* Price */}
            <div className="h-6 w-1/4 bg-slate-200 rounded"></div> {/* Availability */}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/5 bg-slate-200 rounded"></div> {/* Option Label */}
            <div className="h-11 w-full bg-slate-200 rounded-md"></div> {/* Select Trigger */}
          </div>
          <div className="h-12 w-full bg-slate-300 rounded-lg"></div> {/* Add to Cart Button */}
          <div className="h-5 w-3/5 bg-slate-200 rounded"></div> {/* Secure Payment Text */}
        </div>
      </div>

      {/* Product Details Accordion Skeleton */}
      <div className="mt-12 md:mt-16 pt-8 border-t">
        <div className="h-8 w-1/3 bg-slate-200 rounded mb-6"></div> {/* Details Title */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="h-6 w-2/5 bg-slate-200 rounded mb-2"></div> {/* Accordion Trigger */}
              {/* Accordion Content can be skipped or simplified for loading state */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
