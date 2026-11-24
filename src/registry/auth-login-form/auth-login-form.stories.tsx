import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, userEvent, waitFor, within } from 'storybook/test'

import { LoginForm } from './auth-login-form'

const meta = {
  title: 'Cyphix/Auth Login Form',
  component: LoginForm,
  tags: ['autodocs'],
  args: {
    appName: 'Cyphix',
    title: 'Sign in',
    description: 'Sign in to your Cyphix account.',
    next: '/settings/profile',
    onSuccess: fn(),
  },
  argTypes: {
    appName: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    next: { control: 'text' },
    logo: { control: false },
    onSuccess: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const PasswordSuccess: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Username or email'), 'admin')
    await userEvent.type(canvas.getByLabelText('Password'), 'DemoPassword123!')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalled())
  },
}

export const PasswordError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(await canvas.findByLabelText('Username or email'), 'admin')
    await userEvent.type(canvas.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
    await expect(await canvas.findByText('Use admin / DemoPassword123!')).toBeInTheDocument()
  },
}

export const PasskeyError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Sign in with a passkey' }))
    await expect(await canvas.findByText('Passkey ceremonies require a real goauth server.')).toBeInTheDocument()
  },
}
