import type { Metadata } from "next";
import AccountAddressesClient from "./AccountAddressesClient";

export const metadata: Metadata = {
  title: "Saved Addresses",
  description: "Save and manage your shipping addresses.",
};

export default function AccountAddressesPage() {
  return <AccountAddressesClient />;
}
