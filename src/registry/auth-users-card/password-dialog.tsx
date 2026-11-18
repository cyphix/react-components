import { useForm } from "@tanstack/react-form";
import { useEffect, useId } from "react";
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
import { passwordPairSchema } from "./auth-password";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** When false, the current-password field is hidden (set/reset flows). */
  requireCurrent: boolean;
  submitLabel: string;
  isPending: boolean;
  serverError?: string | null;
  onSubmit: (values: { currentPassword: string; newPassword: string }) => void;
}

export function PasswordDialog({
  open,
  onOpenChange,
  title,
  description,
  requireCurrent,
  submitLabel,
  isPending,
  serverError,
  onSubmit,
}: PasswordDialogProps) {
  const schema = passwordPairSchema.extend({
    currentPassword: requireCurrent
      ? z.string().min(1, "Required")
      : z.string(),
  });

  const formId = useId();
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      onSubmit({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          id={formId}
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {requireCurrent && (
              <form.Field name="currentPassword">
                {(field) => (
                  <Field
                    data-invalid={
                      field.state.meta.errors.length > 0 || undefined
                    }
                  >
                    <FieldLabel htmlFor={field.name}>
                      Current password
                    </FieldLabel>
                    <Input
                      autoComplete="current-password"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      type="password"
                      value={field.state.value}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            )}
            <form.Field name="newPassword">
              {(field) => (
                <Field
                  data-invalid={field.state.meta.errors.length > 0 || undefined}
                >
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <Input
                    autoComplete="new-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    type="password"
                    value={field.state.value}
                  />
                  <FieldDescription>At least 8 characters.</FieldDescription>
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
            {serverError && (
              <p className="text-destructive text-sm">{serverError}</p>
            )}
          </FieldGroup>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit" form={formId}>
            {isPending ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
