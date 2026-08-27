import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale" | "soldout" | "default";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const styles = {
    new: "bg-new text-white",
    sale: "bg-sale text-white",
    soldout: "bg-foreground/80 text-white",
    default: "bg-border text-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
