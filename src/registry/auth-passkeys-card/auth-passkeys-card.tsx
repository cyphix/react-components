import {
  type Passkey,
  useDeletePasskey,
  usePasskeyRegister,
  usePasskeys,
} from "@cyphix/auth-react";
import { useForm } from "@tanstack/react-form";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Required").max(64),
});

export function PasskeysCard() {
  const { data: passkeys, isLoading, error } = usePasskeys();
  const register = usePasskeyRegister();
  const deletePasskey = useDeletePasskey();
  const [addOpen, setAddOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Passkey | null>(null);

  const form = useForm({
    defaultValues: { name: "Passkey" },
    validators: { onSubmit: nameSchema },
    onSubmit: ({ value }) => {
      setAddError(null);
      register.mutate(value.name, {
        onSuccess: () => {
          toast.success("Passkey added");
          setAddOpen(false);
          form.reset();
        },
        onError: (err) => {
          setAddError(err.message);
          toast.error(err.message);
        },
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription>
              Sign in with a device passkey instead of a password.
            </CardDescription>
          </div>
          <Button onClick={() => setAddOpen(true)} size="sm" variant="outline">
            <Plus /> Add passkey
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">{error.message}</p>
        ) : !passkeys?.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyRound />
              </EmptyMedia>
              <EmptyTitle>No passkeys</EmptyTitle>
              <EmptyDescription>
                Add a passkey to sign in without a password.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y">
            {passkeys.map((passkey) => (
              <li
                className="flex items-center justify-between gap-4 py-3"
                key={passkey.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{passkey.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Added {new Date(passkey.createdAt).toLocaleDateString()}
                    {" · "}
                    {passkey.lastUsedAt
                      ? `Last used ${new Date(passkey.lastUsedAt).toLocaleDateString()}`
                      : "Never used"}
                  </p>
                </div>
                <Button
                  onClick={() => setRemoving(passkey)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 /> Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog onOpenChange={setAddOpen} open={addOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add passkey</DialogTitle>
            <DialogDescription>
              Name this passkey so you can tell your devices apart.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => (
                  <Field
                    data-invalid={
                      field.state.meta.errors.length > 0 || undefined
                    }
                  >
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      value={field.state.value}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              {addError && (
                <p className="text-destructive text-sm">{addError}</p>
              )}
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button onClick={() => setAddOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={register.isPending}
              onClick={() => form.handleSubmit()}
            >
              {register.isPending ? "Waiting for your device…" : "Add passkey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(next) => {
          if (!next) setRemoving(null);
        }}
        open={removing !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {removing?.name}?</DialogTitle>
            <DialogDescription>
              You will no longer be able to sign in with this passkey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRemoving(null)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={deletePasskey.isPending}
              onClick={() => {
                if (!removing) return;
                deletePasskey.mutate(removing.id, {
                  onSuccess: () => {
                    toast.success("Passkey removed");
                    setRemoving(null);
                  },
                  onError: (err) => toast.error(err.message),
                });
              }}
              variant="destructive"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
