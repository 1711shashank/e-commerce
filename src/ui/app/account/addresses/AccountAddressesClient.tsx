"use client";

import { AccountShell } from "@/components/account/AccountShell";
import { AddressManager } from "@/components/account/AddressManager";
import { RequireCustomerSession } from "@/components/auth/RequireCustomerSession";

export default function AccountAddressesClient() {
  return (
    <RequireCustomerSession>
      <AccountShell title="Saved addresses" breadcrumbLabel="Saved addresses">
        <AddressManager />
      </AccountShell>
    </RequireCustomerSession>
  );
}
