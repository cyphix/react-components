import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { StateGrid } from '@/internal/state-grid'

export function KbdShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'single key', node: <Kbd>Esc</Kbd> },
        {
          label: 'group',
          node: (
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          ),
        },
        {
          label: 'combination',
          node: (
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <span className="text-xs text-muted-foreground">+</span>
              <Kbd>K</Kbd>
            </KbdGroup>
          ),
        },
        {
          label: 'in text',
          node: (
            <span className="text-sm text-muted-foreground">
              Press <Kbd>Enter</Kbd> to submit
            </span>
          ),
        },
      ]}
    />
  )
}
