import { cn } from "@/lib/utils";
import { labelClassName } from "./form-styles";

type FormLabelProps = {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormLabel({
  htmlFor,
  required,
  children,
  className,
}: FormLabelProps) {
  const mark = required ? (
    <span className="text-sale" aria-hidden="true">
      {" "}
      *
    </span>
  ) : null;

  if (htmlFor) {
    return (
      <label className={cn(labelClassName, className)} htmlFor={htmlFor}>
        {children}
        {mark}
      </label>
    );
  }

  return (
    <span className={cn(labelClassName, "block", className)}>
      {children}
      {mark}
    </span>
  );
}

export function FormLegend({
  required,
  children,
  className,
}: {
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <legend className={cn(labelClassName, className)}>
      {children}
      {required ? (
        <span className="text-sale" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </legend>
  );
}
