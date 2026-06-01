import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
}

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary" &&
          "bg-amber-500 hover:bg-amber-600 text-white",
        variant === "ghost" &&
          "hover:bg-gray-100 text-gray-700",
        variant === "outline" &&
          "border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
