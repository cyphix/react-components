import { AuthClient, AuthClientContext, type AuthUser } from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { LoginForm } from "./auth-login-form";

function deferred<T>() {
 let resolve!: (value: T) => void;
 let reject!: (error: Error) => void;
 const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
 return { promise, resolve, reject };
}

it("replaces password errors with passkey errors and vice versa", async () => {
 const client = new AuthClient();
 vi.spyOn(client, "getConfig").mockResolvedValue({ passwordLogin: true, passkeys: true, oidcMode: "disabled", oidcProviders: [], devAutoLogin: false });
 vi.spyOn(client, "login").mockRejectedValue(new Error("Password rejected"));
 vi.spyOn(client, "passkeyLogin").mockRejectedValue(new Error("Passkey rejected"));
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><AuthClientContext.Provider value={client}><LoginForm appName="Test" /></AuthClientContext.Provider></QueryClientProvider>);
 await userEvent.type(await screen.findByLabelText("Username or email"), "alice");
 await userEvent.type(screen.getByLabelText("Password"), "badpassword");
 await userEvent.click(screen.getByRole("button", {name:"Sign in"}));
 expect(await screen.findByText("Password rejected")).toBeInTheDocument();
 await userEvent.click(screen.getByRole("button", {name:"Sign in with a passkey"}));
 expect(await screen.findByText("Passkey rejected")).toBeInTheDocument();
 expect(screen.queryByText("Password rejected")).not.toBeInTheDocument();
 await userEvent.click(screen.getByRole("button", {name:"Sign in"}));
 expect(await screen.findByText("Password rejected")).toBeInTheDocument();
 expect(screen.queryByText("Passkey rejected")).not.toBeInTheDocument();
});

it.each(["password", "passkey"])("completes a successful %s attempt after switching methods", async (first) => {
 const client = new AuthClient();
 vi.spyOn(client, "getConfig").mockResolvedValue({ passwordLogin: true, passkeys: true, oidcMode: "disabled", oidcProviders: [], devAutoLogin: false });
 const password = deferred<AuthUser>();
 const passkey = deferred<AuthUser>();
 const login = vi.spyOn(client, "login").mockReturnValue(password.promise);
 const passkeyLogin = vi.spyOn(client, "passkeyLogin").mockReturnValue(passkey.promise);
 const onSuccess = vi.fn();
 render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><AuthClientContext.Provider value={client}><LoginForm appName="Test" onSuccess={onSuccess} /></AuthClientContext.Provider></QueryClientProvider>);
 await userEvent.type(await screen.findByLabelText("Username or email"), "alice");
 await userEvent.type(screen.getByLabelText("Password"), "password");
 const passwordButton = () => screen.getByRole("button", {name:"Sign in"});
 const passkeyButton = () => screen.getByRole("button", {name:"Sign in with a passkey"});
 await userEvent.click(first === "password" ? passwordButton() : passkeyButton());
 await userEvent.click(first === "password" ? passkeyButton() : passwordButton());
 await waitFor(() => { expect(login).toHaveBeenCalledTimes(1); expect(passkeyLogin).toHaveBeenCalledTimes(1); });
 const user: AuthUser = { id: 1, username: "alice", email: null, role: "user", disabled: false, hasPassword: true, passkeyCount: 0, oidcLinked: false, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" };
 await act(async () => { (first === "password" ? password : passkey).resolve(user); });
 await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(user));
 await act(async () => { (first === "password" ? passkey : password).reject(new Error("Latest attempt rejected")); });
 expect(await screen.findByText("Latest attempt rejected")).toBeInTheDocument();
 expect(onSuccess).toHaveBeenCalledTimes(1);
});
