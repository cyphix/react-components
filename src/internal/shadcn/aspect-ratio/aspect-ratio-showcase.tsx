import { AspectRatio } from '@/components/ui/aspect-ratio'
import { StateGrid } from '@/internal/state-grid'

function RatioBox({ label }: { label: string }) {
  return (
    <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
      {label}
    </div>
  )
}

export function AspectRatioShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: '16 / 9',
          node: (
            <div className="w-48">
              <AspectRatio ratio={16 / 9}>
                <RatioBox label="16:9" />
              </AspectRatio>
            </div>
          ),
        },
        {
          label: '4 / 3',
          node: (
            <div className="w-48">
              <AspectRatio ratio={4 / 3}>
                <RatioBox label="4:3" />
              </AspectRatio>
            </div>
          ),
        },
        {
          label: '1 / 1',
          node: (
            <div className="w-32">
              <AspectRatio ratio={1}>
                <RatioBox label="1:1" />
              </AspectRatio>
            </div>
          ),
        },
      ]}
    />
  )
}
