import { Skeleton } from '@/components/ui/skeleton'
import { StateGrid } from '@/internal/state-grid'

export function SkeletonShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'line', node: <Skeleton className="h-4 w-48" /> },
        { label: 'circle', node: <Skeleton className="size-10 rounded-full" /> },
        { label: 'rectangle', node: <Skeleton className="h-24 w-48" /> },
        {
          label: 'card',
          node: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}
