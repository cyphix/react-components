import type { Meta, StoryObj } from '@storybook/react-vite'

import { requireAdminBeforeLoad } from "@/registry/auth-admin-guard/auth-admin-guard";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
function AuthAdminGuardShowcase() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [status, setStatus] = useState("");
  return (
    <>
      <Button
        onClick={() => {
          void requireAdminBeforeLoad({ context: { queryClient }, location }).then(
            () => setStatus("Admin access allowed"),
            () => setStatus("Non-admin redirected"),
          );
        }}
      >
        Check admin access
      </Button>
      <p>{status}</p>
    </>
  );
}

const meta = {
  title: 'Cyphix/Auth Admin Guard',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AuthAdminGuardShowcase />,
}
