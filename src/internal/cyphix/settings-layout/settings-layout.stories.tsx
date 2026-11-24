import type { Meta, StoryObj } from '@storybook/react-vite'

import { SettingsLayout } from "@/registry/settings-layout/settings-layout";
function SettingsLayoutShowcase() {
  return (
    <SettingsLayout
      title="Settings"
      description="Manage your account."
      nav={<span>Profile</span>}
    >
      Your settings appear here.
    </SettingsLayout>
  );
}

const meta = {
  title: 'Cyphix/Settings Layout',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SettingsLayoutShowcase />,
}
