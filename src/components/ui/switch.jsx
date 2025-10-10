import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      checked: {
        true: "bg-green-500",
        false: "bg-gray-300",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

export const Switch = React.forwardRef(({ checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      ref={ref}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(switchVariants({ checked }))}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";
