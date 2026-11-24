import type { Meta, StoryObj } from '@storybook/react-vite'

import { SettingsNav } from "@/registry/settings-nav/settings-nav";
import { User, Users } from "lucide-react";
function SettingsNavShowcase() {
  return (
    <SettingsNav
      isAdmin
      sections={[
        { to: "/", label: "Profile", icon: User },
        { to: "/setup-test", label: "Users", icon: Users, admin: true },
      ]}
    />
  );
}

const meta = {
  tags: ['autodocs'],
  title: 'Cyphix/Settings Nav',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SettingsNavShowcase />,
}
