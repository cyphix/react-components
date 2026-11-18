import { render, screen } from "@testing-library/react";
import { User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { SettingsNav } from "./settings-nav";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));
const sections = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/users", label: "Users", icon: User, admin: true },
];
describe("SettingsNav", () => {
  it("hides admin sections by default", () => {
    render(<SettingsNav sections={sections} />);
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/profile",
    );
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
  });
  it("shows admin sections for admins", () => {
    render(<SettingsNav sections={sections} isAdmin />);
    expect(screen.getByRole("link", { name: "Users" })).toBeInTheDocument();
  });
  it("renders an empty navigation", () => {
    render(<SettingsNav sections={[]} />);
    expect(screen.getByRole("navigation")).toBeEmptyDOMElement();
  });
});
