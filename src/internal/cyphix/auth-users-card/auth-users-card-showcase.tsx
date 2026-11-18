import { UsersCard } from "@/registry/auth-users-card/auth-users-card";
import { SettingsLayout } from "@/registry/settings-layout/settings-layout";
import { SettingsNav } from "@/registry/settings-nav/settings-nav";
import { Shield, User } from "lucide-react";

export function AuthUsersCardShowcase() {
  return (
    <SettingsLayout
      title="Settings"
      description="Manage your account and users."
      nav={
        <SettingsNav
          isAdmin
          sections={[
            { to: "/components/auth-profile-card", label: "Profile", icon: User },
            { to: "/components/auth-users-card", label: "Users", icon: Shield, admin: true },
          ]}
        />
      }
    >
      <UsersCard />
    </SettingsLayout>
  );
}
