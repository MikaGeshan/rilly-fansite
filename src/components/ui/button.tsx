import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          // Variants
          "bg-zinc-950 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200":
            variant === "primary",
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700":
            variant === "secondary",
          "border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900":
            variant === "outline",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800": variant === "ghost",

          // Sizes
          "h-9 px-3 text-sm": size === "sm",
          "h-10 px-4 text-base": size === "md",
          "h-11 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
