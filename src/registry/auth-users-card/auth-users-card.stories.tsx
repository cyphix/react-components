import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { UsersCard } from './auth-users-card'

const meta = {
  title: 'Cyphix/Auth Users Card',
  component: UsersCard,
  tags: ['autodocs'],
  args: {},
  argTypes: {
    adminAvatarPath: { control: false },
    avatarBaseUrl: { control: 'text' },
  },
} satisfies Meta<typeof UsersCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('admin')).toBeInTheDocument()
    await expect(canvas.getByText('alice')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for alice' }))
    await expect(await within(document.body).findByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
    await expect(within(document.body).getByRole('menuitem', { name: 'Reset password' })).toBeInTheDocument()
    await expect(within(document.body).getByRole('menuitem', { name: 'Disable' })).toBeInTheDocument()
    await expect(within(document.body).getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  },
}

export const ChangeRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('combobox', { name: 'Role for alice' })
    await userEvent.click(trigger)
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Admin' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Admin'))
    await userEvent.click(trigger)
    await userEvent.click(await within(document.body).findByRole('option', { name: 'User' }))
    await waitFor(() => expect(trigger).toHaveTextContent('User'))
  },
}

export const DeleteFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Actions for alice' }))
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Delete' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(within(dialog).getByText('Delete alice?')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await expect(await canvas.findByText('alice')).toBeInTheDocument()
  },
}
