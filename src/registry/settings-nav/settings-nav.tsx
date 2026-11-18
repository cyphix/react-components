import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface SettingsNavProps {
  sections: { to: string; label: string; icon: LucideIcon; admin?: boolean }[];
  isAdmin?: boolean;
}
export function SettingsNav({ sections, isAdmin = false }: SettingsNavProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto md:w-48 md:flex-col">
      {sections
        .filter((s) => !s.admin || isAdmin)
        .map((s) => (
          <Link
            activeOptions={{ exact: true }}
            className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground text-sm hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
            key={s.to}
            to={s.to}
          >
            <s.icon className="size-4" />
            {s.label}
          </Link>
        ))}
    </nav>
  );
}
