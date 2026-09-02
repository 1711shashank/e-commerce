import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Aurelia account password.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordClient />;
}
