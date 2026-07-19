import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered";
}

const variants = {
  default: "bg-[var(--color-card)]",
  bordered: "bg-[var(--color-card)] border border-[var(--color-border)]",
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-2xl p-6", variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
