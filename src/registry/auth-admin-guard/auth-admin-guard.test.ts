import {
	AuthClient,
	type AuthUser,
	authQueryKeys,
} from "@cyphix/auth-react";
import { QueryClient } from "@tanstack/react-query";
import { isRedirect } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAdminBeforeLoad } from "./auth-admin-guard";

const user: AuthUser = {
	id: 1,
	username: "alice",
	email: null,
	role: "user",
	disabled: false,
	hasPassword: true,
	passkeyCount: 0,
	oidcLinked: false,
	createdAt: "2025-01-01T00:00:00Z",
	updatedAt: "2025-01-01T00:00:00Z",
};

const admin: AuthUser = { ...user, id: 2, username: "boss", role: "admin" };

const newQueryClient = () =>
	new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe("requireAdminBeforeLoad", () => {
	let queryClient: QueryClient;
	let client: AuthClient;
	beforeEach(() => {
		queryClient = newQueryClient();
		client = new AuthClient();
	});

	it("lets admins through", async () => {
		vi.spyOn(client, "me").mockResolvedValue(admin);
		queryClient.setQueryData(authQueryKeys.me, admin);
		await expect(
			requireAdminBeforeLoad({ context: { queryClient }, client }),
		).resolves.toBeUndefined();
	});

	it("redirects non-admins to the profile section", async () => {
		vi.spyOn(client, "me").mockResolvedValue(user);
		queryClient.setQueryData(authQueryKeys.me, user);
		const err = await requireAdminBeforeLoad({
			context: { queryClient },
			client,
		}).catch((e) => e);
		expect(isRedirect(err)).toBe(true);
		expect(err.options.to).toBe("/settings/profile");
	});

	it("revalidates cached admins before allowing access", async () => {
		queryClient.setQueryData(authQueryKeys.me, admin);
		const me = vi.spyOn(client, "me").mockResolvedValue(admin);
		await requireAdminBeforeLoad({ context: { queryClient }, client });
		me.mockResolvedValue(user);
		const err = await requireAdminBeforeLoad({ context: { queryClient }, client }).catch((e) => e);
		expect(me).toHaveBeenCalledTimes(2);
		expect(isRedirect(err)).toBe(true);
		expect(err.options.to).toBe("/settings/profile");
	});

	it.each([null, new Error("Session expired")])("redirects when the server returns %s", async (result) => {
		queryClient.setQueryData(authQueryKeys.me, admin);
		const me = vi.spyOn(client, "me");
		if (result instanceof Error) me.mockRejectedValue(result);
		else me.mockResolvedValue(result);
		const err = await requireAdminBeforeLoad({ context: { queryClient }, client, redirectTo: "/login" }).catch((e) => e);
		expect(isRedirect(err)).toBe(true);
		expect(err.options.to).toBe("/login");
	});
});
