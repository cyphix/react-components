import type { Meta, StoryObj } from '@storybook/react-vite'

import { SetupTestPage } from './setup-test-page'

const meta = {
  title: 'Internal/Setup Test',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SetupTestPage />,
}
