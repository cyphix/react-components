import type { AuthUser } from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const admin: AuthUser = {
  id: 1,
  username: "boss",
  email: null,
  role: "admin",
  disabled: false,
  hasPassword: true,
  passkeyCount: 0,
  oidcLinked: false,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const alice: AuthUser = {
  ...admin,
  id: 2,
  username: "alice",
  email: "alice@example.com",
  role: "user",
  hasPassword: false,
  passkeyCount: 2,
};

const updateUser = { mutate: vi.fn(), isPending: false };
const deleteUser = { mutate: vi.fn(), isPending: false };
const createUser = { mutate: vi.fn(), isPending: false };
let usersResult: { data?: AuthUser[]; isLoading: boolean; error?: Error } = {
  data: [admin, alice],
  isLoading: false,
};

vi.mock("@cyphix/auth-react", async () => {
  const actual =
    await vi.importActual<typeof import("@cyphix/auth-react")>(
      "@cyphix/auth-react",
    );
  return {
    ...actual,
    useMe: () => ({ data: admin }),
    useAdminUsers: () => usersResult,
    useAdminCreateUser: () => createUser,
    useAdminUpdateUser: () => updateUser,
    useAdminDeleteUser: () => deleteUser,
  };
});

import { UsersCard } from "./auth-users-card";

afterEach(() => {
  cleanup();
  usersResult = { data: [admin, alice], isLoading: false };
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function renderCard() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <UsersCard />
    </QueryClientProvider>,
  );
}

describe("UsersCard", () => {
  it("stacks account details and labels compact sign-in methods", () => {
    renderCard();
    expect(screen.getByRole("columnheader", {name:"Account"})).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", {name:"Email"})).not.toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toHaveClass("truncate");
    const methods = screen.getAllByRole("img", {name:"2 passkeys"});
    expect(methods).toHaveLength(2);
    expect(methods[0]).toHaveAttribute("title", "2 passkeys");
    expect(methods[0].closest("td")).toBe(screen.getByText("alice@example.com").closest("td"));
    expect(methods[1].closest("td")).toHaveClass("hidden", "@lg:table-cell");
    expect(screen.getByRole("columnheader", {name:"Methods"})).toHaveClass("hidden", "@lg:table-cell");
    expect(screen.getByRole("table")).toHaveClass("min-w-64", "table-fixed");
    expect(screen.getByRole("button", {name:"Actions for alice"}).closest("td")).toHaveClass("sticky", "right-0", "bg-card", "z-10");
  });
  it.each(["boss", "alice"])("guards self-edit controls when editing %s", async (username) => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: `Actions for ${username}` }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Edit" }));
    const role = screen.getByRole("combobox", { name: "Role" });
    const disabled = screen.getByRole("switch", { name: "Disabled" });
    if (username === "boss") {
      expect(role).toBeDisabled();
      expect(disabled).toHaveAttribute("aria-disabled", "true");
    } else {
      expect(role).not.toBeDisabled();
      expect(disabled).not.toHaveAttribute("aria-disabled", "true");
    }
  });
  it("renders an empty list", () => {
    usersResult = { data: [], isLoading: false };
    renderCard();
    expect(screen.queryByText("alice")).not.toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });
  it("renders a server error", () => {
    usersResult = { isLoading: false, error: new Error("Access denied") };
    renderCard();
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });
  it("lists users without prompting via window", async () => {
    const promptSpy = vi.fn();
    const confirmSpy = vi.fn();
    vi.stubGlobal("prompt", promptSpy);
    vi.stubGlobal("confirm", confirmSpy);
    renderCard();
    expect(await screen.findByText("boss")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(promptSpy).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it("reset password opens a dialog, blocks mismatch, submits on match", async () => {
    renderCard();
    await screen.findByText("alice");
    await userEvent.click(
      screen.getByRole("button", { name: "Actions for alice" }),
    );
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Reset password" }),
    );
    expect(
      await screen.findByText("Reset password for alice"),
    ).toBeInTheDocument();

    await userEvent.type(
      screen.getByLabelText("New password"),
      "long-enough-password",
    );
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "mismatch-password",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Reset password" }),
    );
    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
    expect(updateUser.mutate).not.toHaveBeenCalled();

    await userEvent.clear(screen.getByLabelText("Confirm password"));
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "long-enough-password",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Reset password" }),
    );
    await waitFor(() =>
      expect(updateUser.mutate).toHaveBeenCalledWith(
        { id: 2, input: { password: "long-enough-password" } },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      ),
    );
  });

  it.each(["boss", "alice"])("guards destructive menu actions for %s", async (username) => {
    renderCard();
    await screen.findByText(username);
    await userEvent.click(
      screen.getByRole("button", { name: `Actions for ${username}` }),
    );
    const deleteItem = await screen.findByRole("menuitem", {
      name: "Delete",
    });
    const disableItem = screen.getByRole("menuitem", { name: "Disable" });
    expect(screen.getByRole("menuitem", { name: "Edit" })).not.toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("menuitem", { name: "Reset password" })).not.toHaveAttribute("aria-disabled", "true");
    if (username === "boss") {
      expect(deleteItem).toHaveAttribute("aria-disabled", "true");
      expect(disableItem).toHaveAttribute("aria-disabled", "true");
    } else {
      expect(deleteItem).not.toHaveAttribute("aria-disabled", "true");
      expect(disableItem).not.toHaveAttribute("aria-disabled", "true");
      await userEvent.click(disableItem);
      expect(updateUser.mutate).toHaveBeenCalledWith(
        { id: alice.id, input: { disabled: true } },
        expect.objectContaining({ onError: expect.any(Function) }),
      );
    }
  });
});
