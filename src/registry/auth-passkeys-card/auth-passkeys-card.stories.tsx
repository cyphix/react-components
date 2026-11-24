import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { PasskeysCard } from './auth-passkeys-card'

const meta = {
  title: 'Cyphix/Auth Passkeys Card',
  component: PasskeysCard,
  tags: ['autodocs'],
} satisfies Meta<typeof PasskeysCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Laptop')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Add passkey' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(within(dialog).getByRole('heading', { name: 'Add passkey' })).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Add passkey' }))
    await expect(await within(dialog).findByText('Passkey ceremonies require a real goauth server.')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
  },
}

export const RemoveFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Remove' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(within(dialog).getByText('Remove Laptop?')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await expect(await canvas.findByText('Laptop')).toBeInTheDocument()
  },
}
