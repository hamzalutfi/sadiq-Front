export default function LoadingOffersPage() {
  return (
    <div className="bg-slate-50 min-h-screen animate-pulse">
      <div className="container py-12 md:py-20">
        <header className="text-center mb-12 md:mb-16">
          <div className="h-16 w-16 mx-auto bg-slate-200 rounded-full mb-6"></div>
          <div className="h-12 w-3/4 md:w-1/2 mx-auto bg-slate-200 rounded-lg"></div>
          <div className="mt-5 h-6 w-full max-w-2xl mx-auto bg-slate-200 rounded-lg"></div>
          <div className="mt-3 h-6 w-3/4 max-w-xl mx-auto bg-slate-200 rounded-lg"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 bg-slate-200"></div> {/* Image Placeholder */}
              <div className="p-5 space-y-3">
                <div className="h-4 w-1/4 bg-slate-200 rounded"></div> {/* Category Placeholder */}
                <div className="h-6 w-3/4 bg-slate-200 rounded"></div> {/* Title Placeholder */}
                <div className="h-4 w-full bg-slate-200 rounded"></div> {/* Description Line 1 */}
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div> {/* Description Line 2 */}
                <div className="h-10 w-1/3 bg-slate-300 rounded-md mt-2"></div> {/* Discount Badge Placeholder */}
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div> {/* Valid Until Placeholder */}
              </div>
              <div className="p-4 bg-slate-100 border-t border-slate-200">
                <div className="h-10 w-full bg-slate-300 rounded-md"></div> {/* Button Placeholder */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
