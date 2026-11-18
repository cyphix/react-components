import { useAdminCreateUser } from "@cyphix/auth-react";
import { useForm } from "@tanstack/react-form";
import { useEffect, useId } from "react";
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
  FieldDescription,
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
import { PASSWORD_MAX, PASSWORD_MIN } from "./auth-password";

const createUserSchema = z
  .object({
    username: z
      .string()
      .regex(
        /^[a-z0-9][a-z0-9._-]{1,62}[a-z0-9]$/,
        "3-64 chars of a-z, 0-9, '.', '_' or '-'",
      ),
    email: z.union([z.literal(""), z.email("Invalid email address")]),
    role: z.enum(["user", "admin"]),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((value, ctx) => {
    if (!value.newPassword && !value.confirmPassword) return;
    if (value.newPassword.length < PASSWORD_MIN) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: `At least ${PASSWORD_MIN} characters`,
      });
    } else if (value.newPassword.length > PASSWORD_MAX) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: `At most ${PASSWORD_MAX} characters`,
      });
    }
    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export function CreateUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createUser = useAdminCreateUser();

  const formId = useId();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "user" as "user" | "admin",
      newPassword: "",
      confirmPassword: "",
    },
    validators: { onSubmit: createUserSchema },
    onSubmit: ({ value }) => {
      createUser.mutate(
        {
          username: value.username,
          email: value.email || undefined,
          role: value.role,
          password: value.newPassword || undefined,
        },
        {
          onSuccess: () => {
            toast.success(`User ${value.username} created`);
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
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Leave the password blank to create a passwordless account.
          </DialogDescription>
        </DialogHeader>
        <form
          id={formId}
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
            <form.Field name="newPassword">
              {(field) => (
                <Field
                  data-invalid={field.state.meta.errors.length > 0 || undefined}
                >
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type="password"
                    value={field.state.value}
                  />
                  <FieldDescription>
                    Optional. At least {PASSWORD_MIN} characters when set.
                  </FieldDescription>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <Field
                  data-invalid={field.state.meta.errors.length > 0 || undefined}
                >
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type="password"
                    value={field.state.value}
                  />
                  <FieldError errors={field.state.meta.errors} />
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
            disabled={createUser.isPending}
            type="submit" form={formId}
          >
            {createUser.isPending ? "Saving…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
