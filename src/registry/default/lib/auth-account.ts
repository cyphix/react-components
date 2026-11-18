import { type AuthUser, authQueryKeys } from "@cyphix/auth-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function avatarUrl(
  user: Pick<AuthUser, "updatedAt">,
  path = "/api/me/avatar",
) {
  return `${path}?v=${encodeURIComponent(user.updatedAt)}`;
}
export function adminAvatarUrl(
  user: Pick<AuthUser, "id" | "updatedAt">,
  path: (id: number) => string = (id) => `/api/admin/users/${id}/avatar`,
) {
  return avatarUrl(user, path(user.id));
}
async function changeAvatar(path: string, method: string, body?: FormData, loginPath = "/login") {
  const response = await fetch(path, {
    method,
    body,
    credentials: "same-origin",
  });
  if (response.status === 401) window.location.assign(loginPath);
  if (!response.ok)
    throw new Error(`Avatar request failed (${response.status})`);
}
export function useUploadAvatar(path = "/api/me/avatar", loginPath = "/login") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      await changeAvatar(path, "PUT", form, loginPath);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
  });
}
export function useDeleteAvatar(path = "/api/me/avatar", loginPath = "/login") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => changeAvatar(path, "DELETE", undefined, loginPath),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
  });
}
