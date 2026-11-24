import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { SettingsLayout } from './settings-layout'

const meta = {
  title: 'Cyphix/Settings Layout',
  component: SettingsLayout,
  tags: ['autodocs'],
  args: {
    title: 'Settings',
    description: 'Manage your account.',
    nav: <span>Profile</span>,
    children: 'Your settings appear here.',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    nav: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof SettingsLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Settings')).toBeInTheDocument()
    await expect(canvas.getByText('Manage your account.')).toBeInTheDocument()
    await expect(canvas.getByText('Your settings appear here.')).toBeInTheDocument()
  },
}
