import {
  AuthApiError, AuthClient, AuthClientContext, type AuthUser,
  authQueryKeys, requireAuthBeforeLoad, useMe,
} from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory, createRootRouteWithContext, createRoute,
  createRouter, Outlet, RouterProvider,
} from "@tanstack/react-router";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ProfileCard } from "@/registry/auth-profile-card/auth-profile-card";
import { SettingsLayout } from "@/registry/settings-layout/settings-layout";
import { requireAdminBeforeLoad } from "./auth-admin-guard";

const admin: AuthUser = {
  id: 1, username: "alice", email: null, role: "admin", disabled: false,
  hasPassword: true, passkeyCount: 0, oidcLinked: false, createdAt: "", updatedAt: "",
};

beforeEach(() => { vi.spyOn(window, "scrollTo").mockImplementation(() => {}); });

async function setup(initialPath: string) {
  const client = new AuthClient();
  const me = vi.spyOn(client, "me").mockResolvedValue(admin);
  const getConfig = vi.spyOn(client, "getConfig").mockRejectedValue(new Error("Unexpected parent auth config lookup"));
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(authQueryKeys.me, admin);
  const root = createRootRouteWithContext<{ queryClient: QueryClient }>()({ component: Outlet });
  const login = createRoute({ getParentRoute: () => root, path: "/login", component: () => <h1>Login page</h1> });
  const authed = createRoute({
    getParentRoute: () => root, id: "_authed",
    beforeLoad: requireAuthBeforeLoad({ client }), component: Outlet,
  });
  function Settings() {
    const { data: user } = useMe();
    return <SettingsLayout title="Settings" description="Account settings" nav={<span>{user?.role}</span>}><Outlet /></SettingsLayout>;
  }
  const settings = createRoute({ getParentRoute: () => authed, path: "settings", component: Settings });
  function Profile() {
    const { data: user } = useMe();
    return user ? <ProfileCard user={user} /> : null;
  }
  const profile = createRoute({ getParentRoute: () => settings, path: "profile", component: Profile });
  const security = createRoute({ getParentRoute: () => settings, path: "security", component: () => <h1>Security page</h1> });
  const users = createRoute({
    getParentRoute: () => settings, path: "users",
    beforeLoad: args => requireAdminBeforeLoad({ ...args, client }),
    component: () => <h1>Admin users page</h1>,
  });
  const router = createRouter({
    routeTree: root.addChildren([login, authed.addChildren([settings.addChildren([profile, security, users])])]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient }, defaultPendingMinMs: 0,
  });
  await router.load();
  render(<QueryClientProvider client={queryClient}><AuthClientContext.Provider value={client}><RouterProvider router={router} /></AuthClientContext.Provider></QueryClientProvider>);
  return { router, me, queryClient, getConfig };
}

it.each(["/settings/profile", "/settings/security"])("renders Profile after demotion when navigating from %s", async initialPath => {
  const { router, me, queryClient } = await setup(initialPath);
  me.mockResolvedValue({ ...admin, role: "user" });
  await act(async () => { await router.navigate({ to: "/settings/users" } as never); });
  expect(router.state.location.pathname).toBe("/settings/profile");
  expect(await screen.findByDisplayValue("alice")).toBeInTheDocument();
  expect(screen.getByText("Your public identity: username, email and avatar.")).toBeInTheDocument();
  expect(screen.queryByText("Admin users page")).not.toBeInTheDocument();
  expect(queryClient.getQueryState(authQueryKeys.me)?.status).toBe("success");
  expect(queryClient.getQueryData<AuthUser>(authQueryKeys.me)?.role).toBe("user");
});

it.each([null, new AuthApiError(401, "Session expired")])("sends a revoked session straight to login without resolving Profile (%s)", async result => {
  const { router, me, queryClient, getConfig } = await setup("/settings/profile");
  if (result) me.mockRejectedValue(result);
  else me.mockResolvedValue(null);
  await act(async () => { await router.navigate({ to: "/settings/users", search: { page: 2 } } as never); });
  expect(router.state.location.pathname).toBe("/login");
  expect(router.state.location.search).toEqual({ redirect: "/settings/users?page=2" });
  expect(await screen.findByRole("heading", { name: "Login page" })).toBeInTheDocument();
  expect(queryClient.getQueryData(authQueryKeys.me)).toBeNull();
  expect(screen.queryByText("Admin users page")).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue("alice")).not.toBeInTheDocument();
  expect(getConfig).not.toHaveBeenCalled();
});
