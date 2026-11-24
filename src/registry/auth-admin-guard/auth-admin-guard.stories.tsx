import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthClient, type AuthUser } from '@cyphix/auth-react'
import { useQueryClient } from '@tanstack/react-query'
import { isRedirect } from '@tanstack/react-router'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { requireAdminBeforeLoad } from './auth-admin-guard'

type Session = 'admin' | 'user' | 'guest'

function clientFor(session: Session): AuthClient {
  const client = new AuthClient()
  const user: AuthUser = {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    role: session === 'admin' ? 'admin' : 'user',
    disabled: false,
    hasPassword: true,
    passkeyCount: 0,
    oidcLinked: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }
  client.me = async () => (session === 'guest' ? null : user)
  return client
}

function Demo({
  session,
  redirectTo,
  loginTo,
  locationHref,
}: {
  session: Session
  redirectTo: string
  loginTo: string
  locationHref: string
}) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('')
  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        onClick={() => {
          void requireAdminBeforeLoad({
            context: { queryClient },
            location: { href: locationHref },
            redirectTo,
            loginTo,
            client: clientFor(session),
          }).then(
            () => setStatus('Admin access allowed'),
            (error: unknown) => {
              if (isRedirect(error)) {
                const options = (error as { options?: { to?: string; search?: unknown } }).options
                setStatus(`Redirect to ${options?.to ?? 'unknown'}${options?.search ? ` ${JSON.stringify(options.search)}` : ''}`)
              } else {
                setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
              }
            },
          )
        }}
      >
        Check admin access
      </Button>
      <p className="text-sm">{status}</p>
    </div>
  )
}

const meta = {
  title: 'Cyphix/Auth Admin Guard',
  component: Demo,
  tags: ['autodocs'],
  args: {
    session: 'admin',
    redirectTo: '/settings/profile',
    loginTo: '/login',
    locationHref: '/settings/users?page=2',
  },
  argTypes: {
    session: { control: 'select', options: ['admin', 'user', 'guest'] },
    redirectTo: { control: 'text' },
    loginTo: { control: 'text' },
    locationHref: { control: 'text' },
  },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const AdminAllowed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Check admin access' }))
    await expect(await canvas.findByText('Admin access allowed')).toBeInTheDocument()
  },
}

export const NonAdminRedirect: Story = {
  args: { session: 'user' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Check admin access' }))
    await expect(await canvas.findByText('Redirect to /settings/profile')).toBeInTheDocument()
  },
}

export const GuestRedirect: Story = {
  args: { session: 'guest' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Check admin access' }))
    await expect(await canvas.findByText('Redirect to /login {"redirect":"/settings/users?page=2"}')).toBeInTheDocument()
  },
}
