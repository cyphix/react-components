import type { Meta, StoryObj } from '@storybook/react-vite'

import { PasskeysCard } from "@/registry/auth-passkeys-card/auth-passkeys-card";
function AuthPasskeysCardShowcase() {
  return <PasskeysCard />;
}

const meta = {
  title: 'Cyphix/Auth Passkeys Card',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AuthPasskeysCardShowcase />,
}
