import type { Meta, StoryObj } from '@storybook/react-vite'
import { User, Users } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { SettingsNav } from './settings-nav'

const sections = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/users', label: 'Users', icon: Users, admin: true },
]

const meta = {
  title: 'Cyphix/Settings Nav',
  component: SettingsNav,
  tags: ['autodocs'],
  args: { sections, isAdmin: true },
  argTypes: {
    sections: { control: false },
    isAdmin: { control: 'boolean' },
  },
} satisfies Meta<typeof SettingsNav>

export default meta

type Story = StoryObj<typeof meta>

export const Admin: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Profile')).toBeInTheDocument()
    await expect(canvas.getByText('Users')).toBeInTheDocument()
  },
}

export const Member: Story = {
  args: { isAdmin: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Profile')).toBeInTheDocument()
    await expect(canvas.queryByText('Users')).not.toBeInTheDocument()
  },
}
