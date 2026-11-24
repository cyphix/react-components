import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Callout, CalloutDescription, CalloutTitle } from './callout'

const meta = {
  title: 'Cyphix/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: { variant: 'info' },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'destructive'] },
  },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Callout {...args}>
      <CalloutTitle>Heads up</CalloutTitle>
      <CalloutDescription>This is an informational callout.</CalloutDescription>
    </Callout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('note')).toHaveTextContent('Heads up')
    await expect(canvas.getByRole('note')).toHaveTextContent('informational callout')
  },
}
