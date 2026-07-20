import { Separator } from '@/components/ui/separator'
import { StateGrid } from '@/internal/state-grid'

export function SeparatorShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'horizontal',
          node: (
            <div className="w-64">
              <p className="text-sm">Section one</p>
              <Separator className="my-3" />
              <p className="text-sm">Section two</p>
            </div>
          ),
        },
        {
          label: 'vertical',
          node: (
            <div className="flex h-6 items-center gap-3 text-sm">
              <span>Blog</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Source</span>
            </div>
          ),
        },
      ]}
    />
  )
}
