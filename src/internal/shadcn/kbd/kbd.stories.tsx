import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { StateGrid } from '@/internal/state-grid'

function KbdShowcase() {
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

const meta = {
  title: 'Shadcn/Kbd',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <KbdShowcase />,
}
