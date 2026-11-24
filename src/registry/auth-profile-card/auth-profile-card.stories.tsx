import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, screen, userEvent, within } from 'storybook/test'

import { profileUser } from '@/storybook/cyphix-fixtures'
import { ProfileCard } from './auth-profile-card'

const meta = {
  title: 'Cyphix/Auth Profile Card',
  component: ProfileCard,
  tags: ['autodocs'],
  args: {
    user: profileUser,
    avatarPath: '/api/me/avatar',
    accept: 'image/png,image/jpeg,image/gif,image/webp',
  },
  argTypes: {
    user: { control: false },
    avatarPath: { control: 'text' },
    avatarBaseUrl: { control: 'text' },
    accept: { control: 'text' },
  },
} satisfies Meta<typeof ProfileCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(canvas.getByLabelText('Username'))
    await userEvent.type(canvas.getByLabelText('Username'), 'alice-updated')
    await userEvent.clear(canvas.getByLabelText('Email'))
    await userEvent.type(canvas.getByLabelText('Email'), 'alice@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Save profile' }))
    await screen.findByText('Profile updated')
  },
}

export const AvatarUpload: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] },
    })
    await screen.findByText('Avatar updated')
    await userEvent.click(await canvas.findByRole('button', { name: 'Remove' }))
    await screen.findByText('Avatar removed')
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
    expect(args.user.username).toBe('alice')
  },
}

export const CustomAccept: Story = {
  args: { accept: 'image/*' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
    await expect(input).toHaveAttribute('accept', 'image/*')
  },
}
