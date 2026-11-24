import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, within } from 'storybook/test'

import { UploadProgress } from './upload-progress'

const meta = {
  title: 'Cyphix/Upload Progress',
  component: UploadProgress,
  tags: ['autodocs'],
  args: {
    fileName: 'photo.png',
    state: 'uploading',
    uploadPercent: 40,
    processingPercent: 0,
    errorMessage: 'Upload failed.',
    onCancel: fn(),
    onRetry: fn(),
  },
  argTypes: {
    fileName: { control: 'text' },
    state: { control: 'select', options: ['uploading', 'processing', 'complete', 'error'] },
    uploadPercent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    processingPercent: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    errorMessage: { control: 'text' },
    onCancel: { control: false },
    onRetry: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof UploadProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Uploading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress for photo.png' })).toHaveAttribute('aria-valuenow', '40')
  },
}

export const Processing: Story = {
  args: { state: 'processing', uploadPercent: 100, processingPercent: 65 },
}

export const Complete: Story = {
  args: { state: 'complete', uploadPercent: 100, processingPercent: 100 },
}

export const Error: Story = {
  args: { state: 'error', uploadPercent: 100, processingPercent: 0 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Upload failed.')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Retry upload of photo.png' }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}

export const Cancel: Story = {
  args: { state: 'uploading', uploadPercent: 25 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel upload of photo.png' }))
    await expect(args.onCancel).toHaveBeenCalled()
  },
}
