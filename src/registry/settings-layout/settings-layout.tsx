import type { ReactNode } from "react";
export interface SettingsLayoutProps {
  title: ReactNode;
  description: ReactNode;
  nav: ReactNode;
  children: ReactNode;
}
export function SettingsLayout({
  title,
  description,
  nav,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        {nav}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
