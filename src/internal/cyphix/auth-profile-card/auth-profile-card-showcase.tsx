import { ProfileCard } from "@/registry/auth-profile-card/auth-profile-card";
import { useMe } from "@cyphix/auth-react";
export function AuthProfileCardShowcase() {
  const { data: user } = useMe();
  return user ? <ProfileCard user={user} /> : <p>Loading profile…</p>;
}
