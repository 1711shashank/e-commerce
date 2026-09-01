"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCustomerAuthStore } from "@/lib/customer-auth-store";
import { usePersistHydrated } from "@/lib/use-persist-hydrated";

export function CheckoutButton({
  className,
  children = "Checkout",
  onBeforeNavigate,
}: {
  className?: string;
  children?: React.ReactNode;
  onBeforeNavigate?: () => void;
}) {
  const router = useRouter();
  const hydrated = usePersistHydrated(useCustomerAuthStore.persist);
  const access = useCustomerAuthStore((s) => s.access);
  const user = useCustomerAuthStore((s) => s.user);

  const handleClick = () => {
    onBeforeNavigate?.();
    if (!hydrated) return;

    const isCustomer = Boolean(access && user?.role === "customer");
    if (!isCustomer) {
      router.push(`/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }
    router.push("/checkout");
  };

  return (
    <Button className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
