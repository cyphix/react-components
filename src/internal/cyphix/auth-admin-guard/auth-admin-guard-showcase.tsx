import { requireAdminBeforeLoad } from "@/registry/auth-admin-guard/auth-admin-guard";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function AuthAdminGuardShowcase() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  return (
    <>
      <Button
        onClick={() => {
          void requireAdminBeforeLoad({ context: { queryClient } }).then(
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
