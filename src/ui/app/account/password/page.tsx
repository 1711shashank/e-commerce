import type { Metadata } from "next";
import AccountPasswordClient from "./AccountPasswordClient";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password.",
};

export default function AccountPasswordPage() {
  return <AccountPasswordClient />;
}
