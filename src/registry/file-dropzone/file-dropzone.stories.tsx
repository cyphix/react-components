import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, fireEvent, within } from 'storybook/test'

import { FileDropzone } from './file-dropzone'

const meta = {
  title: 'Cyphix/File Dropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  args: {
    accept: 'image/*',
    multiple: true,
    maxFiles: 3,
    maxBytes: 2_000_000,
    description: 'Drop up to three images here (2 MB each).',
    browseLabel: 'Choose files',
    onFilesSelected: fn(),
    onFilesRejected: fn(),
  },
  argTypes: {
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxFiles: { control: { type: 'number', min: 1 } },
    maxBytes: { control: { type: 'number', min: 1 } },
    disabled: { control: 'boolean' },
    browseLabel: { control: 'text' },
    description: { control: 'text' },
    onFilesSelected: { control: false },
    onFilesRejected: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof FileDropzone>

export default meta

type Story = StoryObj<typeof meta>

function fileInput(canvasElement: HTMLElement) {
  return canvasElement.querySelector('input[type="file"]') as HTMLInputElement
}

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    fireEvent.change(fileInput(canvasElement), {
      target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
    })
    await expect(args.onFilesSelected).toHaveBeenCalled()
  },
}

export const RejectsInvalidType: Story = {
  args: { multiple: false },
  play: async ({ args, canvasElement }) => {
    fireEvent.change(fileInput(canvasElement), {
      target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] },
    })
    await expect(args.onFilesRejected).toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: { disabled: true, description: 'File selection is disabled.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Choose files' })).toBeDisabled()
  },
}
