import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'

import { FileDropzone, type FileDropzoneRejection } from '@/registry/file-dropzone/file-dropzone'

const messages: Record<FileDropzoneRejection['reason'], string> = {
  'invalid-type': 'Choose an image.',
  'too-large': 'The file exceeds 2 MB.',
  'too-many-files': 'Choose up to three images at a time.',
}

function FileDropzoneShowcase() {
  const [results, setResults] = useState<string[]>([])

  return (
    <div className="grid max-w-lg gap-4">
      <FileDropzone
        accept="image/*"
        multiple
        maxFiles={3}
        maxBytes={2_000_000}
        description="Drop up to three images here (2 MB each)."
        onFilesSelected={(files) => setResults((prev) => [...files.map((file) => `Selected ${file.name}`), ...prev].slice(0, 6))}
        onFilesRejected={(rejections) => setResults((prev) => [...rejections.map(({ file, reason }) => `${file.name}: ${messages[reason]}`), ...prev].slice(0, 6))}
      />
      <div role="status" className="grid gap-1 break-all text-sm text-muted-foreground">
        {results.length ? results.map((message, index) => <p key={index}>{message}</p>) : <p>No files selected.</p>}
      </div>
      <FileDropzone disabled description="File selection is disabled." onFilesSelected={() => {}} />
    </div>
  )
}

const meta = {
  title: 'Cyphix/File Dropzone',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FileDropzoneShowcase />,
}
