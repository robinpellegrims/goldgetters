import * as React from "react";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children as any, { ...props, ref });
    }
    return (
      <span ref={ref as any} {...props}>
        {children}
      </span>
    );
  }
);
Slot.displayName = "Slot";
