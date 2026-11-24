import type { Meta, StoryObj } from '@storybook/react-vite'

import { UploadProgressShowcase } from './upload-progress-showcase'

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Upload Progress',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <UploadProgressShowcase />,
}
