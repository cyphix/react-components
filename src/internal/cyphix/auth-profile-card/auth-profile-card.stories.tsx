import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProfileCard } from "@/registry/auth-profile-card/auth-profile-card";
import { useMe } from "@cyphix/auth-react";
function AuthProfileCardShowcase() {
  const { data: user } = useMe();
  return user ? <ProfileCard user={user} /> : <p>Loading profile…</p>;
}

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Auth Profile Card',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AuthProfileCardShowcase />,
}
