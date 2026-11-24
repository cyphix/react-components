import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { attachments } from '@/storybook/cyphix-fixtures'
import { AttachmentList, type AttachmentListItem } from './attachment-list'

const meta = {
  title: 'Cyphix/Attachment List',
  component: AttachmentList,
  tags: ['autodocs'],
  args: {
    attachments,
    emptyMessage: 'No attachments yet.',
  },
  argTypes: {
    attachments: { control: false },
    onRemove: { control: false },
    emptyMessage: { control: 'text' },
    className: { control: false },
  },
} satisfies Meta<typeof AttachmentList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Favicon.svg')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Download Favicon.svg' })).toHaveAttribute('href', '/favicon.svg')
  },
}

function RemovableAttachmentList({ emptyMessage }: { emptyMessage?: string }) {
  const [items, setItems] = useState<AttachmentListItem[]>(attachments)
  return (
    <AttachmentList
      attachments={items}
      emptyMessage={emptyMessage}
      onRemove={(attachment) => setItems((current) => current.filter(({ id }) => id !== attachment.id))}
    />
  )
}

export const Removable: Story = {
  render: (args) => <RemovableAttachmentList emptyMessage={args.emptyMessage} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Notes.pdf' }))
    await expect(canvas.queryByText('Notes.pdf')).not.toBeInTheDocument()
    await expect(canvas.getByText('Favicon.svg')).toBeInTheDocument()
  },
}
