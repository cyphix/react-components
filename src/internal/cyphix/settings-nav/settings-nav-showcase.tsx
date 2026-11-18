import { SettingsNav } from "@/registry/settings-nav/settings-nav";
import { User, Users } from "lucide-react";
export function SettingsNavShowcase() {
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
