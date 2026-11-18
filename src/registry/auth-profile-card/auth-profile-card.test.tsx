import { type AuthUser } from "@cyphix/auth-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ProfileCard } from "./auth-profile-card";

afterEach(() => vi.unstubAllGlobals());
const user: AuthUser = { id:1, username:"alice", email:null, role:"user", disabled:false, hasPassword:true, passkeyCount:0, oidcLinked:false, createdAt:"", updatedAt:"" };

it("restricts the avatar picker to PNG, JPEG, GIF and WebP", async () => {
 const fetch = vi.fn().mockResolvedValue(new Response(null, {status:204}));
 vi.stubGlobal("fetch", fetch);
 const {container} = render(<QueryClientProvider client={new QueryClient()}><ProfileCard user={user} avatarBaseUrl="https://api.example.test" /></QueryClientProvider>);
 const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
 expect(input).toHaveAttribute("accept", "image/png,image/jpeg,image/gif,image/webp");
 await userEvent.upload(input, new File(["svg"], "image.svg", {type:"image/svg+xml"}));
 expect(fetch).not.toHaveBeenCalled();
 for (const type of ["image/png", "image/jpeg", "image/gif", "image/webp"]) {
  await userEvent.upload(input, new File(["image"], "avatar", {type}));
 }
 expect(fetch).toHaveBeenCalledTimes(4);
 expect(fetch).toHaveBeenCalledWith("https://api.example.test/api/me/avatar", expect.objectContaining({method:"PUT"}));
});
