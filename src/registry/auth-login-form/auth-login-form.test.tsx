import { AuthClient, AuthClientContext } from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { LoginForm } from "./auth-login-form";

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
