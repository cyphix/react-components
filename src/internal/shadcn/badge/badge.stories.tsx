import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'
import { StateGrid } from '@/internal/state-grid'

function BadgeShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Badge>Badge</Badge> },
        { label: 'secondary', node: <Badge variant="secondary">Badge</Badge> },
        {
          label: 'destructive',
          node: <Badge variant="destructive">Badge</Badge>,
        },
        { label: 'outline', node: <Badge variant="outline">Badge</Badge> },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Badge',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <BadgeShowcase />,
}
