import type { Meta, StoryObj } from '@storybook/react-vite'

import { UsersCard } from "@/registry/auth-users-card/auth-users-card";
import { SettingsLayout } from "@/registry/settings-layout/settings-layout";
import { SettingsNav } from "@/registry/settings-nav/settings-nav";
import { Shield, User } from "lucide-react";

function AuthUsersCardShowcase() {
  return (
    <SettingsLayout
      title="Settings"
      description="Manage your account and users."
      nav={
        <SettingsNav
          isAdmin
          sections={[
            { to: "/", label: "Profile", icon: User },
            { to: "/setup-test", label: "Users", icon: Shield, admin: true },
          ]}
        />
      }
    >
      <UsersCard />
    </SettingsLayout>
  );
}

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Auth Users Card',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AuthUsersCardShowcase />,
}
