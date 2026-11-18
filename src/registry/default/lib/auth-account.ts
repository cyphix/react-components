import { type AuthUser, authQueryKeys } from "@cyphix/auth-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function avatarUrl(
  user: Pick<AuthUser, "updatedAt">,
  path = "/api/me/avatar",
  baseUrl = "",
) {
  return `${avatarPath(path, baseUrl)}?v=${encodeURIComponent(user.updatedAt)}`;
}
export function adminAvatarUrl(
  user: Pick<AuthUser, "id" | "updatedAt">,
  path: (id: number) => string = (id) => `/api/admin/users/${id}/avatar`,
  baseUrl = "",
) {
  return avatarUrl(user, path(user.id), baseUrl);
}
function avatarPath(path: string, baseUrl: string) {
  if (!baseUrl || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
async function changeAvatar(path: string, method: string, body?: FormData, loginPath = "/login") {
  const response = await fetch(path, {
    method,
    body,
    credentials: "include",
  });
  if (response.status === 401) window.location.assign(loginPath);
  if (!response.ok)
    throw new Error(`Avatar request failed (${response.status})`);
}
export function useUploadAvatar(path = "/api/me/avatar", loginPath = "/login", baseUrl = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      await changeAvatar(avatarPath(path, baseUrl), "PUT", form, loginPath);
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
      queryClient.invalidateQueries({ queryKey: authQueryKeys.users }),
    ]),
  });
}
export function useDeleteAvatar(path = "/api/me/avatar", loginPath = "/login", baseUrl = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => changeAvatar(avatarPath(path, baseUrl), "DELETE", undefined, loginPath),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
      queryClient.invalidateQueries({ queryKey: authQueryKeys.users }),
    ]),
  });
}
