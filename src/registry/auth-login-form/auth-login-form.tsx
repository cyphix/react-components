import {
  type AuthUser,
  useAuthClient,
  useAuthConfig,
  useLogin,
  usePasskeyLogin,
} from "@cyphix/auth-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { KeyRound } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const OIDC_ERROR_MESSAGES: Record<string, string> = {
  provider_unavailable:
    "The identity provider is unreachable. Check the provider configuration.",
  provider_error: "The identity provider rejected the login.",
  no_pending_login: "The login attempt expired. Please try again.",
  state_mismatch: "The login attempt could not be verified. Please try again.",
  exchange_failed: "The identity provider rejected the login exchange.",
  missing_id_token: "The identity provider response was incomplete.",
  invalid_id_token: "The identity provider token could not be verified.",
  nonce_mismatch: "The login attempt could not be verified. Please try again.",
  invalid_claims: "The identity provider response was invalid.",
  missing_subject: "The identity provider response was missing a subject.",
  not_provisioned:
    "This account has not been provisioned. Contact an administrator.",
  account_disabled: "This account is disabled.",
};

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

/** How long a config load or OIDC redirect may take before it is flagged. */
const HANG_WARNING_MS = 10_000;

export interface LoginFormProps {
  appName: string;
  logo?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Called after any successful login (password or passkey). */
  onSuccess?: (user: AuthUser) => void;
  /** Path the OIDC flow should land on after login. Default "/". */
  next?: string;
  className?: string;
}

export function LoginForm({
  appName,
  logo,
  title = "Sign in",
  description = `Sign in to your ${appName} account.`,
  onSuccess,
  next = "/",
  className,
}: LoginFormProps) {
  const client = useAuthClient();
  const {
    data: config,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useAuthConfig();
  const login = useLogin();
  const passkeyLogin = usePasskeyLogin();

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => {
      login.reset();
      passkeyLogin.reset();
      void login.mutateAsync(value).then(
        (user) => onSuccess?.(user),
        () => {},
      );
    },
  });

  const oidcError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    if (!code) {
      return null;
    }
    return OIDC_ERROR_MESSAGES[code] ?? `Login failed (${code}).`;
  }, []);

  const exclusive = config?.oidcMode === "required";
  const firstProvider = config?.oidcProviders[0];

  // Flag a config request that stays pending — e.g. the API server is down
  // or a process on the proxy target accepts connections without responding.
  const [configTimedOut, setConfigTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setConfigTimedOut(false);
      return;
    }
    const timer = window.setTimeout(
      () => setConfigTimedOut(true),
      HANG_WARNING_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  // Flag an OIDC redirect that leaves the browser on this page — e.g. the
  // provider start endpoint is hanging instead of returning a redirect.
  const [redirectTimedOut, setRedirectTimedOut] = useState(false);

  // Exclusive mode: bypass the local login page entirely.
  useEffect(() => {
    if (!(exclusive && firstProvider) || oidcError) {
      return;
    }
    window.location.assign(client.oidcStartUrl(firstProvider.id, next));
    const timer = window.setTimeout(
      () => setRedirectTimedOut(true),
      HANG_WARNING_MS,
    );
    return () => window.clearTimeout(timer);
  }, [exclusive, firstProvider, oidcError, client, next]);

  const cardClass = cn("w-full max-w-sm", className);

  if (isError && !config) {
    return (
      <Card className={cardClass}>
        <CardHeader>
          {logo}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertDescription>
              Could not load sign-in options: {error.message}. Check that the
              API server is running and reachable.
            </AlertDescription>
          </Alert>
          <Button
            disabled={isRefetching}
            onClick={() => refetch()}
            type="button"
            variant="outline"
          >
            {isRefetching ? "Retrying…" : "Retry"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !config) {
    return (
      <Card className={cardClass}>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Loading sign-in options…
          </p>
          {configTimedOut && (
            <Alert variant="destructive">
              <AlertDescription>
                The server is not responding. Check that the API server is
                running and that the dev proxy target matches its port.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  if (exclusive && !oidcError) {
    return (
      <Card className={cardClass}>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Redirecting to {firstProvider?.name ?? "your identity provider"}…
          </p>
          {redirectTimedOut && (
            <>
              <Alert variant="destructive">
                <AlertDescription>
                  The sign-in redirect is taking longer than expected — the
                  identity provider may be unreachable.
                </AlertDescription>
              </Alert>
              {firstProvider && (
                <Button
                  nativeButton={false}
                  render={
                    <a href={client.oidcStartUrl(firstProvider.id, next)}>
                      Try again
                    </a>
                  }
                  variant="outline"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const handlePasskeyLogin = () => {
    login.reset();
    passkeyLogin.reset();
    void passkeyLogin.mutateAsync().then(
      (user) => onSuccess?.(user),
      () => {},
    );
  };

  const mutationError = login.error ?? passkeyLogin.error;
  const showOidcProviders =
    config.oidcMode !== "disabled" && config.oidcProviders.length > 0;
  const hasAlternatives = config.passkeys || showOidcProviders;

  return (
    <Card className={cardClass}>
      <CardHeader>
        {logo}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {oidcError && (
          <Alert variant="destructive">
            <AlertDescription>{oidcError}</AlertDescription>
          </Alert>
        )}

        {config.passwordLogin && (
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
                    data-invalid={
                      field.state.meta.errors.length > 0 || undefined
                    }
                  >
                    <FieldLabel htmlFor={field.name}>
                      Username or email
                    </FieldLabel>
                    <Input
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      required
                      value={field.state.value}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field
                    data-invalid={
                      field.state.meta.errors.length > 0 || undefined
                    }
                  >
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      autoComplete="current-password"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      required
                      type="password"
                      value={field.state.value}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <Button disabled={login.isPending} type="submit">
                {login.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
        )}

        {config.passwordLogin && hasAlternatives && (
          <FieldSeparator>or continue with</FieldSeparator>
        )}

        {config.passkeys && (
          <Button
            disabled={passkeyLogin.isPending}
            onClick={handlePasskeyLogin}
            type="button"
            variant="outline"
          >
            <KeyRound />
            {passkeyLogin.isPending
              ? "Waiting for passkey…"
              : "Sign in with a passkey"}
          </Button>
        )}

        {showOidcProviders &&
          config.oidcProviders.map((provider) => (
            <Button
              key={provider.id}
              nativeButton={false}
              render={
                <a href={client.oidcStartUrl(provider.id, next)}>
                  Sign in with {provider.name}
                </a>
              }
              variant="outline"
            />
          ))}

        {mutationError && (
          <Alert variant="destructive">
            <AlertDescription>{mutationError.message}</AlertDescription>
          </Alert>
        )}

        {exclusive && oidcError && firstProvider && (
          <Button
            nativeButton={false}
            render={
              <a href={client.oidcStartUrl(firstProvider.id, next)}>
                Retry sign in with {firstProvider.name}
              </a>
            }
            variant="outline"
          />
        )}
      </CardContent>
    </Card>
  );
}
