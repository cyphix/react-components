import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { StateGrid } from '@/internal/state-grid'

export function ToggleGroupShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'multiple',
          node: (
            <ToggleGroup type="multiple" defaultValue={['bold']}>
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>
          ),
        },
        {
          label: 'single',
          node: (
            <ToggleGroup type="single" defaultValue="center">
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          ),
        },
        {
          label: 'outline',
          node: (
            <ToggleGroup type="single" variant="outline" defaultValue="left">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          ),
        },
        {
          label: 'size: sm',
          node: (
            <ToggleGroup type="multiple" size="sm" variant="outline">
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic />
              </ToggleGroupItem>
            </ToggleGroup>
          ),
        },
        {
          label: 'disabled',
          node: (
            <ToggleGroup type="multiple" disabled>
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic />
              </ToggleGroupItem>
            </ToggleGroup>
          ),
        },
      ]}
    />
  )
}
