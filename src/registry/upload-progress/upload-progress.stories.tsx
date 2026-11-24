import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn, expect, userEvent, within } from 'storybook/test'

import { UploadProgress, type UploadProgressProps } from './upload-progress'

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

function TransitionDemo() {
  const [state, setState] = useState<UploadProgressProps['state']>('uploading')
  const [processingPercent, setProcessingPercent] = useState(0)
  const restart = () => {
    setState('uploading')
    setProcessingPercent(0)
  }
  return (
    <div className="grid gap-3">
      <UploadProgress
        fileName="photo.png"
        state={state}
        uploadPercent={state === 'uploading' ? 40 : 100}
        processingPercent={processingPercent}
      />
      <div className="flex flex-wrap gap-2">
        {state === 'uploading' ? (
          <button type="button" onClick={() => setState('processing')}>Start processing</button>
        ) : null}
        {state === 'processing' ? (
          <>
            <button type="button" onClick={() => setProcessingPercent(65)}>Advance processing</button>
            <button type="button" onClick={() => { setProcessingPercent(100); setState('complete') }}>Complete upload</button>
          </>
        ) : null}
        <button type="button" onClick={restart}>Restart transition</button>
      </div>
    </div>
  )
}

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

export const Transition: Story = {
  render: () => <TransitionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const upload = canvas.getByRole('progressbar', { name: 'Upload progress for photo.png' })
    const processing = canvas.getByRole('progressbar', { name: 'Server processing progress for photo.png' })
    await expect(upload).toHaveAttribute('aria-valuenow', '40')
    await userEvent.click(canvas.getByRole('button', { name: 'Start processing' }))
    await expect(upload).toHaveAttribute('aria-valuenow', '100')
    await expect(processing).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByRole('status')).toHaveTextContent('Processing…')
    await userEvent.click(canvas.getByRole('button', { name: 'Advance processing' }))
    await expect(upload).toHaveAttribute('aria-valuenow', '100')
    await expect(processing).toHaveAttribute('aria-valuenow', '65')
    await userEvent.click(canvas.getByRole('button', { name: 'Complete upload' }))
    await expect(processing).toHaveAttribute('aria-valuenow', '100')
    await expect(canvas.getByRole('status')).toHaveTextContent('Upload complete')
    await userEvent.click(await canvas.findByRole('button', { name: 'Restart transition' }))
    await expect(upload).toHaveAttribute('aria-valuenow', '40')
    await expect(processing).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByRole('status')).toHaveTextContent('Uploading…')
    await userEvent.click(canvas.getByRole('button', { name: 'Start processing' }))
    await expect(processing).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByRole('status')).toHaveTextContent('Processing…')
    await userEvent.click(canvas.getByRole('button', { name: 'Restart transition' }))
    await expect(upload).toHaveAttribute('aria-valuenow', '40')
    await expect(processing).toHaveAttribute('aria-valuenow', '0')
    await expect(canvas.getByRole('status')).toHaveTextContent('Uploading…')
  },
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
