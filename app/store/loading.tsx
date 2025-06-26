export default function LoadingStorePage() {
  return (
    <div className="bg-slate-50 animate-pulse">
      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <div className="h-12 w-3/4 md:w-1/2 mx-auto bg-slate-200 rounded-lg"></div>
          <div className="mt-4 h-6 w-full max-w-2xl mx-auto bg-slate-200 rounded-lg"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton */}
          <aside className="hidden lg:block w-1/4">
            <div className="p-6 bg-white rounded-lg shadow-sm space-y-6">
              <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-6 w-full bg-slate-200 rounded"></div>
                <div className="h-6 w-full bg-slate-200 rounded"></div>
                <div className="h-6 w-full bg-slate-200 rounded"></div>
              </div>
              <div className="h-px bg-slate-200"></div>
              <div className="space-y-3">
                <div className="h-6 w-full bg-slate-200 rounded"></div>
                <div className="h-6 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="w-full lg:w-3/4">
            <div className="flex gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="h-11 flex-grow bg-slate-200 rounded-md"></div>
              <div className="h-11 w-40 bg-slate-200 rounded-md"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <div className="aspect-[4/5] bg-slate-200 rounded-lg"></div>
                  <div className="h-5 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-7 w-1/2 bg-slate-200 rounded"></div>
                  <div className="h-10 w-full bg-slate-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
