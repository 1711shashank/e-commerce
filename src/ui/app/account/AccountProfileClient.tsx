"use client";

import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/ProfileForm";
import { RequireCustomerSession } from "@/components/auth/RequireCustomerSession";

export default function AccountProfileClient() {
  return (
    <RequireCustomerSession>
      <AccountShell title="Profile information" breadcrumbLabel="Profile">
        <ProfileForm />
      </AccountShell>
    </RequireCustomerSession>
  );
}
