import {
  type AuthUser,
  useAdminDeleteUser,
  useAdminUpdateUser,
  useAdminUsers,
  useMe,
} from "@cyphix/auth-react";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { PasswordDialog } from "./password-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminAvatarUrl } from "@/registry/auth-account/auth-account";

const ROLE_ITEMS = { user: "User", admin: "Admin" };

function methodBadges(user: AuthUser) {
  const methods: string[] = [];
  if (user.hasPassword) methods.push("Password");
  if (user.passkeyCount > 0)
    methods.push(
      `${user.passkeyCount} passkey${user.passkeyCount === 1 ? "" : "s"}`,
    );
  if (user.oidcLinked) methods.push("OIDC");
  return methods;
}

export function UsersCard({
  adminAvatarPath,
}: { adminAvatarPath?: (id: number) => string } = {}) {
  const { data: me } = useMe();
  const { data: users, isLoading, error } = useAdminUsers();
  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AuthUser | null>(null);
  const [resetTarget, setResetTarget] = useState<AuthUser | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AuthUser | null>(null);

  const update = (
    id: number,
    input: Parameters<typeof updateUser.mutate>[0]["input"],
  ) =>
    updateUser.mutate(
      { id, input },
      { onError: (err) => toast.error(err.message) },
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage accounts, roles and sign-in methods.
            </CardDescription>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            size="sm"
            variant="outline"
          >
            <Plus /> Create user
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">{error.message}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Methods</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
                const isSelf = user.id === me?.id;
                const methods = methodBadges(user);
                return (
                  <TableRow
                    className={user.disabled ? "opacity-60" : undefined}
                    key={user.id}
                  >
                    <TableCell>
                      <Avatar className="size-8">
                        <AvatarImage
                          src={adminAvatarUrl(user, adminAvatarPath)}
                        />
                        <AvatarFallback>
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {user.username}
                        {isSelf && <Badge variant="outline">you</Badge>}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={isSelf}
                        items={ROLE_ITEMS}
                        onValueChange={(value) => {
                          if (value == null) return;
                          update(user.id, { role: value });
                        }}
                        value={user.role}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.disabled ? (
                        <Badge variant="outline">Disabled</Badge>
                      ) : (
                        <Badge>Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {methods.length ? (
                        <span className="flex flex-wrap gap-1">
                          {methods.map((method) => (
                            <Badge key={method} variant="secondary">
                              {method}
                            </Badge>
                          ))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${user.username}`}
                          render={<Button size="icon" variant="ghost" />}
                        >
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditTarget(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setResetError(null);
                              setResetTarget(user);
                            }}
                          >
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              update(user.id, {
                                disabled: !user.disabled,
                              })
                            }
                          >
                            {user.disabled ? "Enable" : "Disable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isSelf}
                            onClick={() => setDeleteTarget(user)}
                            variant="destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CreateUserDialog onOpenChange={setCreateOpen} open={createOpen} />

      {editTarget && (
        <EditUserDialog
          key={editTarget.id}
          onOpenChange={(next) => {
            if (!next) setEditTarget(null);
          }}
          open
          user={editTarget}
        />
      )}

      <PasswordDialog
        isPending={updateUser.isPending}
        onOpenChange={(next) => {
          if (!next) setResetTarget(null);
        }}
        onSubmit={({ newPassword }) => {
          if (!resetTarget) return;
          setResetError(null);
          updateUser.mutate(
            { id: resetTarget.id, input: { password: newPassword } },
            {
              onSuccess: () => {
                toast.success(`Password reset for ${resetTarget.username}`);
                setResetTarget(null);
              },
              onError: (err) => setResetError(err.message),
            },
          );
        }}
        open={resetTarget !== null}
        requireCurrent={false}
        serverError={resetError}
        submitLabel="Reset password"
        title={
          resetTarget
            ? `Reset password for ${resetTarget.username}`
            : "Reset password"
        }
      />

      <Dialog
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
        open={deleteTarget !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.username}?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeleteTarget(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={deleteUser.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteUser.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    toast.success(`${deleteTarget.username} deleted`);
                    setDeleteTarget(null);
                  },
                  onError: (err) => toast.error(err.message),
                });
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
