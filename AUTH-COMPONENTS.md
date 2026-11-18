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
| auth-admin-guard / requireAdminBeforeLoad | `{context: {queryClient}, location: {href}, redirectTo?: string, loginTo?: string, client?: AuthClient}`; non-admins go to /settings/profile, missing/401 sessions to /login with `?redirect=` (auth-react convention); other errors propagate to the route error boundary. Defaults to defaultAuthClient. |
| auth-login-form / LoginForm | `appName: string`, optional `logo`, `title`, `description` (ReactNode), `onSuccess(user)`, `next` ("/"), `className` |
| auth-profile-card / ProfileCard | `user: AuthUser`, `avatarPath?: string` (/api/me/avatar), `avatarBaseUrl?: string`, `accept?: string` (image/png,image/jpeg,image/gif,image/webp) |
| auth-passkeys-card / PasskeysCard | No props; uses AuthClientContext |
| auth-users-card / UsersCard | Optional `adminAvatarPath: (id: number) => string` (defaults to /api/admin/users/:id/avatar), `avatarBaseUrl?: string` |

The users item includes CreateUserDialog, EditUserDialog, PasswordDialog and
password validation. Its dialogs use the same auth client as the card.
Profile and users each include the same shared auth-account library file.
Its avatarUrl, adminAvatarUrl, useUploadAvatar and useDeleteAvatar accept
overridden paths; for Worldbuilder pass `id => "/admin/users/" + id + "/avatar"`
to UsersCard's adminAvatarPath.

ProfileCard's `accept` configures the avatar file picker. Apps whose server supports
other formats can pass `accept="image/*"` or an explicit list such as
`accept="image/png,image/jpeg,image/gif,image/webp,image/bmp,image/tiff"`.
This is a picker hint; the server must still validate uploaded files.

For a separate API origin or deployment prefix, pass your app's configured base
as `avatarBaseUrl` to both cards. The URL helpers accept it as their third argument;
the mutation hooks accept it after `path` and `loginPath`. Absolute avatar paths
are not prefixed. The auth client only exposes an auth `basePath`, not an API
base, so the registry does not infer API routes or read environment variables.
Both avatar mutations invalidate session and admin-user queries.
EditUserDialog accepts `isSelf?: boolean`; UsersCard supplies it to prevent
self-demotion/disable and omits those fields from self-update payloads.

The development showcases use stateful Mirage endpoints. Demo password login is
`admin / DemoPassword123!`. Passkey lists and deletion work in the mock;
registration/login ceremonies deliberately return an explanatory error because
WebAuthn needs a real relying-party server. OIDC is disabled in the mock.
The guard and navigation filtering are presentation/routing aids, not a replacement
for server-side authorization.
