import { type AuthUser, useUpdateProfile } from "@cyphix/auth-react";
import { useForm } from "@tanstack/react-form";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  avatarUrl,
  useDeleteAvatar,
  useUploadAvatar,
} from "@/registry/default/lib/auth-account";

const profileSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-z0-9][a-z0-9._-]{1,62}[a-z0-9]$/,
      "3-64 chars of a-z, 0-9, '.', '_' or '-'",
    ),
  email: z.union([z.literal(""), z.email("Invalid email address")]),
});

export function ProfileCard({
  user,
  avatarPath = "/api/me/avatar",
  avatarBaseUrl,
}: {
  user: AuthUser;
  avatarPath?: string;
  avatarBaseUrl?: string;
}) {
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar(avatarPath, undefined, avatarBaseUrl);
  const deleteAvatar = useDeleteAvatar(avatarPath, undefined, avatarBaseUrl);
  const fileInput = useRef<HTMLInputElement>(null);
  const [hasAvatar, setHasAvatar] = useState(true);

  const form = useForm({
    defaultValues: { username: user.username, email: user.email ?? "" },
    validators: { onSubmit: profileSchema },
    onSubmit: ({ value }) => {
      updateProfile.mutate(
        { username: value.username, email: value.email },
        {
          onSuccess: () => toast.success("Profile updated"),
          onError: (error) => toast.error(error.message),
        },
      );
    },
  });

  const pickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    uploadAvatar.mutate(file, {
      onSuccess: () => {
        setHasAvatar(true);
        toast.success("Avatar updated");
      },
      onError: () => toast.error("Avatar upload failed"),
    });
  };

  const removeAvatar = () => {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => {
        setHasAvatar(false);
        toast.success("Avatar removed");
      },
      onError: () => toast.error("Failed to remove avatar"),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your public identity: username, email and avatar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 text-lg">
            <AvatarImage
              onLoadingStatusChange={(status) =>
                setHasAvatar(status === "loaded")
              }
              src={avatarUrl(user, avatarPath, avatarBaseUrl)}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <input
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={pickFile}
              ref={fileInput}
              type="file"
            />
            <Button
              disabled={uploadAvatar.isPending}
              onClick={() => fileInput.current?.click()}
              size="sm"
              variant="outline"
            >
              <ImagePlus />
              {uploadAvatar.isPending ? "Uploading…" : "Upload avatar"}
            </Button>
            {hasAvatar && (
              <Button
                disabled={deleteAvatar.isPending}
                onClick={removeAvatar}
                size="sm"
                variant="ghost"
              >
                <Trash2 />
                Remove
              </Button>
            )}
          </div>
        </div>

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
                    autoComplete="username"
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
            <Button disabled={updateProfile.isPending} type="submit">
              {updateProfile.isPending ? "Saving…" : "Save profile"}
            </Button>
          </FieldGroup>
        </form>

        {updateProfile.error && (
          <Alert variant="destructive">
            <AlertDescription>{updateProfile.error.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
