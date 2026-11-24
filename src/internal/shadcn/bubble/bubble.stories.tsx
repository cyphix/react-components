import type { Meta, StoryObj } from '@storybook/react-vite'

import { Bubble, BubbleContent, BubbleGroup } from '@/components/ui/bubble'
import { StateGrid } from '@/internal/state-grid'

function BubbleShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Bubble>
                <BubbleContent>Hey! How are you doing?</BubbleContent>
              </Bubble>
            </div>
          ),
        },
        {
          label: 'secondary',
          node: (
            <div className="w-64">
              <Bubble variant="secondary">
                <BubbleContent>Doing great, thanks!</BubbleContent>
              </Bubble>
            </div>
          ),
        },
        {
          label: 'muted',
          node: (
            <div className="w-64">
              <Bubble variant="muted">
                <BubbleContent>Just checking in.</BubbleContent>
              </Bubble>
            </div>
          ),
        },
        {
          label: 'outline',
          node: (
            <div className="w-64">
              <Bubble variant="outline">
                <BubbleContent>An outlined bubble.</BubbleContent>
              </Bubble>
            </div>
          ),
        },
        {
          label: 'destructive',
          node: (
            <div className="w-64">
              <Bubble variant="destructive">
                <BubbleContent>Failed to send message.</BubbleContent>
              </Bubble>
            </div>
          ),
        },
        {
          label: 'align: end',
          node: (
            <div className="w-64">
              <BubbleGroup>
                <Bubble align="end">
                  <BubbleContent>Sent from my side.</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </div>
          ),
        },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Bubble',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <BubbleShowcase />,
}
