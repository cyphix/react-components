import {
  AuthApiError,
  authQueryKeys,
  type AuthClient,
  defaultAuthClient,
  meQueryOptions,
} from "@cyphix/auth-react";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

/**
 * Route guard for admin-only settings sections. Revalidates the session
 * through the router-context queryClient. Missing sessions go to login,
 * authenticated non-admins to Profile; other errors reach the route boundary.
 */
export async function requireAdminBeforeLoad({
  context,
  location,
  redirectTo = "/settings/profile",
  loginTo = "/login",
  client = defaultAuthClient,
}: {
  context: { queryClient: QueryClient };
  location: { href: string };
  redirectTo?: string;
  loginTo?: string;
  client?: AuthClient;
}) {
  const me = await context.queryClient
    .fetchQuery({ ...meQueryOptions(client), staleTime: 0 })
    .catch((error: unknown) => {
      if (!(error instanceof AuthApiError) || error.status !== 401) throw error;
      context.queryClient.setQueryData(authQueryKeys.me, null);
      return null;
    });
  if (!me) {
    throw redirect({ to: loginTo, search: { redirect: location.href } } as never);
  }
  if (me.role !== "admin") {
    throw redirect({ to: redirectTo });
  }
}
