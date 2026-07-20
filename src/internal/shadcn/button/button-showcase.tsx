import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { StateGrid } from '@/internal/state-grid'

export function ButtonShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Button>Button</Button> },
        {
          label: 'secondary',
          node: <Button variant="secondary">Button</Button>,
        },
        {
          label: 'destructive',
          node: <Button variant="destructive">Button</Button>,
        },
        { label: 'outline', node: <Button variant="outline">Button</Button> },
        { label: 'ghost', node: <Button variant="ghost">Button</Button> },
        { label: 'link', node: <Button variant="link">Button</Button> },
        { label: 'disabled', node: <Button disabled>Button</Button> },
        {
          label: 'loading',
          node: (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Loading
            </Button>
          ),
        },
        { label: 'size: sm', node: <Button size="sm">Button</Button> },
        { label: 'size: lg', node: <Button size="lg">Button</Button> },
      ]}
    />
  )
}
