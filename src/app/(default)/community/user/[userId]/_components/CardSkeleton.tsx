export function CardSkeleton() {
  return (
    <div className="relative box-border h-[120px] max-h-[120px] min-h-[120px] w-full animate-pulse rounded-2xl border border-gray-100 bg-white md:h-[136px] md:max-h-[136px] md:min-h-[136px]">
      <div className="absolute inset-0 flex gap-4 p-4">
        <div className="h-[88px] w-[88px] flex-shrink-0 rounded-xl bg-gray-200 md:h-[104px] md:w-[104px]" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="mb-1 flex flex-shrink-0 gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>
          <div className="h-[44px] flex-shrink-0 space-y-1.5 md:h-[52px]">
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="mt-auto flex flex-shrink-0 gap-4">
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
