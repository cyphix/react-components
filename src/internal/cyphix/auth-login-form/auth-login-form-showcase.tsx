import { LoginForm } from "@/registry/auth-login-form/auth-login-form";
export function AuthLoginFormShowcase() {
  return (
    <LoginForm
      appName="Example App"
      logo={<span className="text-2xl">◈</span>}
    />
  );
}
