import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { authQueryKeys } from "@cyphix/auth-react";
import {
  adminAvatarUrl,
  avatarUrl,
  useUploadAvatar,
  useDeleteAvatar,
} from "./auth-account";

afterEach(() => vi.unstubAllGlobals());
const user = { id: 42, updatedAt: "date with spaces" };
it("defaults to Healtho avatar URLs and accepts other app paths", () => {
  expect(avatarUrl(user)).toBe("/api/me/avatar?v=date%20with%20spaces");
  expect(adminAvatarUrl(user)).toBe(
    "/api/admin/users/42/avatar?v=date%20with%20spaces",
  );
  expect(adminAvatarUrl(user, (id) => `/admin/users/${id}/avatar`)).toBe(
    "/admin/users/42/avatar?v=date%20with%20spaces",
  );
});

it("prefixes avatar image URLs with the app API base without changing absolute paths", () => {
 expect(avatarUrl(user, undefined, "https://api.example.test/prefix/")).toBe("https://api.example.test/prefix/api/me/avatar?v=date%20with%20spaces");
 expect(adminAvatarUrl(user, id => `/admin/users/${id}/avatar`, "/backend/")).toBe("/backend/admin/users/42/avatar?v=date%20with%20spaces");
 expect(avatarUrl(user, "https://images.example.test/avatar", "https://api.example.test")).toBe("https://images.example.test/avatar?v=date%20with%20spaces");
});

it.each(["upload", "delete"])("uses the API base and invalidates session and admin users after %s", async action => {
 const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
 vi.stubGlobal("fetch", fetch);
 const queryClient = new QueryClient();
 queryClient.setQueryData(authQueryKeys.me, user);
 queryClient.setQueryData(authQueryKeys.users, [user]);
 const invalidate = vi.spyOn(queryClient, "invalidateQueries");
 const {result} = renderHook(() => ({upload: useUploadAvatar(undefined, undefined, "https://api.example.test/"), remove: useDeleteAvatar(undefined, undefined, "https://api.example.test/")}), {wrapper: ({children}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>});
 if (action === "upload") await result.current.upload.mutateAsync(new File(["image"], "avatar.png"));
 else await result.current.remove.mutateAsync();
 expect(fetch).toHaveBeenCalledWith("https://api.example.test/api/me/avatar", expect.objectContaining({ method: action === "upload" ? "PUT" : "DELETE", credentials: "include" }));
 expect(invalidate).toHaveBeenCalledWith({queryKey: authQueryKeys.me});
 expect(invalidate).toHaveBeenCalledWith({queryKey: authQueryKeys.users});
 expect(queryClient.getQueryState(authQueryKeys.users)?.isInvalidated).toBe(true);
});

it("does not invalidate queries after an unsuccessful mutation", async () => {
 vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, {status:500})));
 const queryClient = new QueryClient();
 const invalidate = vi.spyOn(queryClient, "invalidateQueries");
 const {result} = renderHook(() => useDeleteAvatar(), {wrapper: ({children}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>});
 await expect(result.current.mutateAsync()).rejects.toThrow("Avatar request failed (500)");
 expect(invalidate).not.toHaveBeenCalled();
});
function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
it("uploads multipart data to the configured path", async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetch);
  const { result } = renderHook(() => useUploadAvatar("/custom/avatar"), {
    wrapper,
  });
  await result.current.mutateAsync(new File(["image"], "avatar.png"));
  expect(fetch).toHaveBeenCalledWith(
    "/custom/avatar",
    expect.objectContaining({ method: "PUT", body: expect.any(FormData) }),
  );
});
it("surfaces failed avatar requests", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
  );
  const { result } = renderHook(() => useDeleteAvatar(), { wrapper });
  await expect(result.current.mutateAsync()).rejects.toThrow(
    "Avatar request failed (403)",
  );
  await waitFor(() => expect(result.current.isError).toBe(true));
});

it.each(["upload", "delete"])("redirects unauthorized %s requests and still throws", async (action) => {
 vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
 const { result } = renderHook(() => ({
 upload: useUploadAvatar(), remove: useDeleteAvatar("/api/me/avatar", "/sign-in")
 }), { wrapper });
 const assign = vi.fn();
 const original = window;
 vi.stubGlobal("window", new Proxy(original, { get(target, key) { return key === "location" ? { assign } : Reflect.get(target, key); } }));
 await expect(action === "upload" ? result.current.upload.mutateAsync(new File(["x"], "a.png")) : result.current.remove.mutateAsync()).rejects.toThrow("Avatar request failed (401)");
 expect(assign).toHaveBeenCalledWith(action === "upload" ? "/login" : "/sign-in");
});
