import {
	type AuthClient,
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

vi.mock("@cyphix/auth-react", async () => {
	const actual =
		await vi.importActual<typeof import("@cyphix/auth-react")>(
			"@cyphix/auth-react",
		);
	return { ...actual, defaultAuthClient: {} as AuthClient };
});

const newQueryClient = () =>
	new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe("requireAdminBeforeLoad", () => {
	let queryClient: QueryClient;
	beforeEach(() => {
		queryClient = newQueryClient();
	});

	it("lets admins through", async () => {
		queryClient.setQueryData(authQueryKeys.me, admin);
		await expect(
			requireAdminBeforeLoad({ context: { queryClient } }),
		).resolves.toBeUndefined();
	});

	it("redirects non-admins to the profile section", async () => {
		queryClient.setQueryData(authQueryKeys.me, user);
		const err = await requireAdminBeforeLoad({
			context: { queryClient },
		}).catch((e) => e);
		expect(isRedirect(err)).toBe(true);
		expect(err.options.to).toBe("/settings/profile");
	});
});
