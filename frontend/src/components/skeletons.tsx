import { Skeleton } from '@/components/ui/skeleton'

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-8 w-28 bg-white/5" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-col items-center">
        <Skeleton className="h-[200px] w-[200px] rounded-full bg-white/5" />
        <div className="w-full pt-4 border-t border-border/50 mt-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full bg-white/5" />
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-10 ml-auto bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TokenListSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          {['Token', 'Price', 'Balance', 'Value', '%'].map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-white/5" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/5" />
                <Skeleton className="h-3 w-12 bg-white/5" />
              </div>
            </div>
            <Skeleton className="h-4 w-16 bg-white/5" />
            <Skeleton className="h-4 w-20 bg-white/5" />
            <Skeleton className="h-4 w-16 bg-white/5" />
            <Skeleton className="h-5 w-12 rounded-md bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NftGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <Skeleton className="aspect-square bg-white/5" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-3 w-2/3 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
