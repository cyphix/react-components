import type { Meta, StoryObj } from '@storybook/react-vite'

import { Progress } from '@/components/ui/progress'
import { StateGrid } from '@/internal/state-grid'

function ProgressShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'empty', node: <Progress className="w-64" value={0} /> },
        { label: '33%', node: <Progress className="w-64" value={33} /> },
        { label: '66%', node: <Progress className="w-64" value={66} /> },
        { label: 'complete', node: <Progress className="w-64" value={100} /> },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Progress',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ProgressShowcase />,
}
