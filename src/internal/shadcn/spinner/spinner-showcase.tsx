import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { StateGrid } from '@/internal/state-grid'

export function SpinnerShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Spinner /> },
        { label: 'size: lg', node: <Spinner className="size-8" /> },
        { label: 'muted', node: <Spinner className="text-muted-foreground" /> },
        {
          label: 'in button',
          node: (
            <Button disabled>
              <Spinner />
              Loading
            </Button>
          ),
        },
      ]}
    />
  )
}
