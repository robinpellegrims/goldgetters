import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/components/ui/slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  asChild?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

const variants: Record<string, string> = {
  default: "bg-yellow-600 text-black hover:bg-yellow-500",
  outline: "border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(baseClasses, variants[variant], className)}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
