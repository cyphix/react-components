# Account settings registry items

Install with `pnpm dlx shadcn@latest add cyphix/react-components/<name>`.
The five `auth-*` items require the consuming app to provide
`@cyphix/auth-react`, typically via `file:../pkg/goauth/web/auth-react`.
It is not an npm dependency of these registry items.
Mount a TanStack Query QueryClientProvider; optionally supply a custom
AuthClient through AuthClientContext. Mount a Sonner Toaster for notifications.
SettingsNav needs a TanStack Router provider.

| Item / export | Props |
| --- | --- |
| settings-nav / SettingsNav | `sections: {to: string; label: string; icon: LucideIcon; admin?: boolean}[]`, `isAdmin?: boolean` (false) |
| settings-layout / SettingsLayout | `title`, `description`, `nav`, `children` (ReactNode) |
| auth-admin-guard / requireAdminBeforeLoad | `{context: {queryClient}, redirectTo?: string, client?: AuthClient}`; defaults to /settings/profile and defaultAuthClient |
| auth-login-form / LoginForm | `appName: string`, optional `logo`, `title`, `description` (ReactNode), `onSuccess(user)`, `next` ("/"), `className` |
| auth-profile-card / ProfileCard | `user: AuthUser`, `avatarPath?: string` (/api/me/avatar) |
| auth-passkeys-card / PasskeysCard | No props; uses AuthClientContext |
| auth-users-card / UsersCard | Optional `adminAvatarPath: (id: number) => string`; defaults to /api/admin/users/:id/avatar |

The users item includes CreateUserDialog, EditUserDialog, PasswordDialog and
password validation. Its dialogs use the same auth client as the card.
Profile and users each include the same shared auth-account library file.
Its avatarUrl, adminAvatarUrl, useUploadAvatar and useDeleteAvatar accept
overridden paths; for Worldbuilder pass `id => "/admin/users/" + id + "/avatar"`
to UsersCard's adminAvatarPath.

The development showcases use stateful Mirage endpoints. Demo password login is
`admin / DemoPassword123!`. Passkey lists and deletion work in the mock;
registration/login ceremonies deliberately return an explanatory error because
WebAuthn needs a real relying-party server. OIDC is disabled in the mock.
The guard and navigation filtering are presentation/routing aids, not a replacement
for server-side authorization.
