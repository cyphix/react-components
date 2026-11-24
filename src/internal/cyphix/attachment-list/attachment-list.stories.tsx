import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'

import { AttachmentList, type AttachmentListItem } from '@/registry/attachment-list/attachment-list'

const sampleAttachments: AttachmentListItem[] = [
  {
    id: 'image',
    name: 'Favicon.svg',
    description: 'SVG image',
    thumbnailUrl: '/favicon.svg',
    downloadUrl: '/favicon.svg',
  },
  { id: 'document', name: 'Notes.pdf', description: 'PDF document' },
]

function AttachmentListShowcase() {
  const [attachments, setAttachments] = useState(sampleAttachments)

  return (
    <div className="grid max-w-lg gap-4">
      <AttachmentList
        attachments={attachments}
        onRemove={(attachment) => setAttachments((prev) => prev.filter(({ id }) => id !== attachment.id))}
      />
      <div className="grid gap-2">
        <h3 className="text-sm font-medium">Read-only</h3>
        <AttachmentList attachments={sampleAttachments} />
      </div>
    </div>
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Attachment List',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AttachmentListShowcase />,
}
