import { Bold, Italic } from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'
import { StateGrid } from '@/internal/state-grid'

export function ToggleShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <Toggle aria-label="Toggle bold">
              <Bold />
            </Toggle>
          ),
        },
        {
          label: 'outline',
          node: (
            <Toggle variant="outline" aria-label="Toggle italic">
              <Italic />
            </Toggle>
          ),
        },
        {
          label: 'pressed',
          node: (
            <Toggle defaultPressed aria-label="Toggle bold">
              <Bold />
            </Toggle>
          ),
        },
        {
          label: 'with text',
          node: (
            <Toggle variant="outline">
              <Italic />
              Italic
            </Toggle>
          ),
        },
        {
          label: 'disabled',
          node: (
            <Toggle disabled aria-label="Toggle bold">
              <Bold />
            </Toggle>
          ),
        },
        {
          label: 'size: sm / lg',
          node: (
            <div className="flex items-center gap-2">
              <Toggle size="sm" variant="outline" aria-label="Small">
                <Bold />
              </Toggle>
              <Toggle size="lg" variant="outline" aria-label="Large">
                <Bold />
              </Toggle>
            </div>
          ),
        },
      ]}
    />
  )
}
