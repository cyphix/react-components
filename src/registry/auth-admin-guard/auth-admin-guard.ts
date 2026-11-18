import {
  type AuthClient,
  defaultAuthClient,
  meQueryOptions,
} from "@cyphix/auth-react";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

/**
 * Route guard for admin-only settings sections. Revalidates the session
 * through the router-context queryClient and bounces non-admins to the
 * profile section.
 */
export async function requireAdminBeforeLoad({
  context,
  redirectTo = "/settings/profile",
  client = defaultAuthClient,
}: {
  context: { queryClient: QueryClient };
  redirectTo?: string;
  client?: AuthClient;
}) {
  const me = await context.queryClient
    .fetchQuery({ ...meQueryOptions(client), staleTime: 0 })
    .catch(() => null);
  if (me?.role !== "admin") {
    throw redirect({ to: redirectTo });
  }
}
