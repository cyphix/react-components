import type { Meta, StoryObj } from '@storybook/react-vite'

import { Textarea } from '@/components/ui/textarea'
import { StateGrid } from '@/internal/state-grid'

function TextareaShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: <Textarea className="w-64" placeholder="Type your message" />,
        },
        {
          label: 'with value',
          node: (
            <Textarea
              className="w-64"
              defaultValue="This textarea has content already typed in it."
            />
          ),
        },
        {
          label: 'disabled',
          node: <Textarea className="w-64" placeholder="Disabled" disabled />,
        },
        {
          label: 'invalid',
          node: (
            <Textarea
              className="w-64"
              aria-invalid
              placeholder="Invalid field"
            />
          ),
        },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Textarea',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TextareaShowcase />,
}
