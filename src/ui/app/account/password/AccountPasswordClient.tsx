"use client";

import { AccountShell } from "@/components/account/AccountShell";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { RequireCustomerSession } from "@/components/auth/RequireCustomerSession";

export default function AccountPasswordClient() {
  return (
    <RequireCustomerSession>
      <AccountShell title="Change password" breadcrumbLabel="Password">
        <ChangePasswordForm />
      </AccountShell>
    </RequireCustomerSession>
  );
}
