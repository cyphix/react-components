import { AuthApiError, AuthClient, type AuthUser, authQueryKeys } from "@cyphix/auth-react";
import { QueryClient } from "@tanstack/react-query";
import { isRedirect } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAdminBeforeLoad } from "./auth-admin-guard";

const user: AuthUser = {
  id: 1, username: "alice", email: null, role: "user", disabled: false,
  hasPassword: true, passkeyCount: 0, oidcLinked: false,
  createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
};
const admin: AuthUser = { ...user, role: "admin" };

describe("requireAdminBeforeLoad", () => {
  let queryClient: QueryClient;
  let client: AuthClient;
  const location = { href: "/settings/users?page=2#accounts" };
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client = new AuthClient();
  });
  const guard = (options = {}) => requireAdminBeforeLoad({
    context: { queryClient }, client, location, ...options,
  });

  it("lets admins through", async () => {
    vi.spyOn(client, "me").mockResolvedValue(admin);
    await expect(guard()).resolves.toBeUndefined();
  });

  it("redirects non-admins to the profile section and caches their user", async () => {
    vi.spyOn(client, "me").mockResolvedValue(user);
    const error = await guard().catch((error) => error);
    expect(isRedirect(error)).toBe(true);
    expect(error.options.to).toBe("/settings/profile");
    expect(queryClient.getQueryData(authQueryKeys.me)).toEqual(user);
  });

  it("revalidates cached admins and honors the non-admin destination", async () => {
    queryClient.setQueryData(authQueryKeys.me, admin);
    const me = vi.spyOn(client, "me").mockResolvedValue(admin);
    await guard();
    me.mockResolvedValue(user);
    const error = await guard({ redirectTo: "/account" }).catch((error) => error);
    expect(me).toHaveBeenCalledTimes(2);
    expect(isRedirect(error)).toBe(true);
    expect(error.options.to).toBe("/account");
  });

  it.each([null, new AuthApiError(401, "Session expired")])(
    "redirects a missing/401 session to login, not Profile (%s)", async (result) => {
      queryClient.setQueryData(authQueryKeys.me, admin);
      const me = vi.spyOn(client, "me");
      if (result) me.mockRejectedValue(result);
      else me.mockResolvedValue(null);
      const error = await guard().catch((error) => error);
      expect(isRedirect(error)).toBe(true);
      expect(error.options.to).toBe("/login");
      expect(error.options.search).toEqual({ redirect: location.href });
      expect(queryClient.getQueryData(authQueryKeys.me)).toBeNull();
    },
  );

  it("honors the login destination", async () => {
    vi.spyOn(client, "me").mockResolvedValue(null);
    const error = await guard({ loginTo: "/sign-in" }).catch((error) => error);
    expect(error.options.to).toBe("/sign-in");
    expect(error.options.search).toEqual({ redirect: location.href });
  });

  it.each([new Error("Offline"), new AuthApiError(403, "Forbidden"), new AuthApiError(500, "Unavailable")])(
    "fails closed by propagating non-401 errors (%s)", async (error) => {
      queryClient.setQueryData(authQueryKeys.me, admin);
      vi.spyOn(client, "me").mockRejectedValue(error);
      await expect(guard()).rejects.toBe(error);
    },
  );
});
