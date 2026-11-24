import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { StateGrid } from '@/internal/state-grid'

function SpinnerShowcase() {
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

const meta = {
  title: 'Shadcn/Spinner',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SpinnerShowcase />,
}
