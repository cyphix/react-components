import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
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
