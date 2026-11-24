import type { Meta, StoryObj } from '@storybook/react-vite'

import { LoginForm } from "@/registry/auth-login-form/auth-login-form";
function AuthLoginFormShowcase() {
  return (
    <LoginForm
      appName="Example App"
      logo={<span className="text-2xl">◈</span>}
    />
  );
}

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Auth Login Form',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AuthLoginFormShowcase />,
}
