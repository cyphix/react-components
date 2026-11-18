import { AuthClient, AuthClientContext, type AuthUser } from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { PasswordDialog } from "./password-dialog";

const user: AuthUser = { id:1, username:"alice", email:null, role:"user", disabled:false, hasPassword:true, passkeyCount:0, oidcLinked:false, createdAt:"", updatedAt:"" };
it.each(["create", "edit"])("submits %s on Enter and labels its controls", async mode => {
 const client = new AuthClient();
 const create = vi.spyOn(client,"adminCreateUser").mockResolvedValue(user);
 const update = vi.spyOn(client,"adminUpdateUser").mockResolvedValue(user);
 render(<QueryClientProvider client={new QueryClient()}><AuthClientContext.Provider value={client}>{mode === "create" ? <CreateUserDialog open onOpenChange={vi.fn()} /> : <EditUserDialog user={user} open onOpenChange={vi.fn()} />}</AuthClientContext.Provider></QueryClientProvider>);
 expect(screen.getByRole("combobox", {name:"Role"})).toBeInTheDocument();
 if (mode === "edit") expect(screen.getByRole("switch", {name:"Disabled"})).toBeInTheDocument();
 const username = screen.getByLabelText("Username");
 if (mode === "create") await userEvent.type(username, "alice");
 await userEvent.type(username, "{Enter}");
 await waitFor(() => expect(mode === "create" ? create : update).toHaveBeenCalled());
});
it("submits password changes on Enter", async () => {
 const onSubmit=vi.fn();
 render(<PasswordDialog open onOpenChange={vi.fn()} onSubmit={onSubmit} title="Password" submitLabel="Save" requireCurrent={false} isPending={false}/>);
 await userEvent.type(screen.getByLabelText("New password"), "password123");
 await userEvent.type(screen.getByLabelText("Confirm password"), "password123{Enter}");
 await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});

it("prevents self-demotion and self-disable while allowing profile edits", async () => {
 const client = new AuthClient();
 const admin = {...user, role: "admin" as const};
 const update = vi.spyOn(client, "adminUpdateUser").mockResolvedValue(admin);
 render(<QueryClientProvider client={new QueryClient()}><AuthClientContext.Provider value={client}><EditUserDialog user={admin} isSelf open onOpenChange={vi.fn()} /></AuthClientContext.Provider></QueryClientProvider>);
 expect(screen.getByRole("combobox", {name:"Role"})).toBeDisabled();
 expect(screen.getByRole("switch", {name:"Disabled"})).toHaveAttribute("aria-disabled", "true");
 const username = screen.getByLabelText("Username");
 await userEvent.clear(username);
 await userEvent.type(username, "alice-updated{Enter}");
 await waitFor(() => expect(update).toHaveBeenCalledWith(user.id, {username:"alice-updated", email:""}));
});
