import React from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function InteractiveHoverButton({
  children,
  className,
  icon,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-foreground/20 bg-background px-6 py-2.5 font-medium text-xs sm:text-sm text-foreground shadow-xs transition-colors duration-300 ease-out hover:border-[var(--accent)] active:scale-[0.97] cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {/* Fluid animated orange fill layer from left to right */}
      <span className="absolute inset-0 bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />

      {/* Resting state content (with messenger plane icon) */}
      <span className="relative z-10 inline-flex items-center gap-2 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-2 group-hover:opacity-0">
        <span>{children}</span>
        {icon ?? <SendHorizontal className="size-4 shrink-0" />}
      </span>

      {/* Hover revealed content on signature brand orange fill */}
      <span className="absolute z-10 inline-flex items-center gap-2 text-[var(--accent-text)] transition-[transform,opacity] duration-300 ease-out -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{children}</span>
        {icon ?? <SendHorizontal className="size-4 shrink-0" />}
      </span>
    </button>
  );
}
