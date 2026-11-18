import { type AuthUser, useAdminUpdateUser } from "@cyphix/auth-react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const editUserSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-z0-9][a-z0-9._-]{1,62}[a-z0-9]$/,
      "3-64 chars of a-z, 0-9, '.', '_' or '-'",
    ),
  email: z.union([z.literal(""), z.email("Invalid email address")]),
  role: z.enum(["user", "admin"]),
  disabled: z.boolean(),
});

/**
 * Admin edit-account dialog. Remount per user via `key={user.id}` at the
 * call site so defaults stay in sync. Password resets go through
 * PasswordDialog instead.
 */
export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useAdminUpdateUser();

  const form = useForm({
    defaultValues: {
      username: user.username,
      email: user.email ?? "",
      role: user.role,
      disabled: user.disabled,
    },
    validators: { onSubmit: editUserSchema },
    onSubmit: ({ value }) => {
      update.mutate(
        {
          id: user.id,
          input: {
            username: value.username,
            email: value.email,
            role: value.role,
            disabled: value.disabled,
          },
        },
        {
          onSuccess: () => {
            toast.success(`Updated ${value.username}`);
            onOpenChange(false);
          },
          onError: (error) => toast.error(error.message),
        },
      );
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {user.username}</DialogTitle>
          <DialogDescription>Update this account's details.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="username">
              {(field) => (
                <Field
                  data-invalid={field.state.meta.errors.length > 0 || undefined}
                >
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                    value={field.state.value}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <Field
                  data-invalid={field.state.meta.errors.length > 0 || undefined}
                >
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    autoComplete="email"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={field.state.value}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    items={{ user: "User", admin: "Admin" }}
                    onValueChange={(value) => {
                      if (value == null) return;
                      field.handleChange(value);
                    }}
                    value={field.state.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="disabled">
              {(field) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                    <FieldLabel className="mb-0">Disabled</FieldLabel>
                  </div>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={update.isPending}
            onClick={() => form.handleSubmit()}
          >
            {update.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
