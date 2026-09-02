import type { Metadata } from "next";
import AccountProfileClient from "./AccountProfileClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your profile and account settings.",
};

export default function AccountPage() {
  return <AccountProfileClient />;
}
