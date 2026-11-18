import { SettingsLayout } from "@/registry/settings-layout/settings-layout";
export function SettingsLayoutShowcase() {
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
