import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 max-w-full rounded-[var(--radius)] font-medium font-sans transition-[background-color,border-color,color,transform,opacity,box-shadow] duration-150 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] cursor-pointer select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--accent-text)] border border-transparent hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)]",
        default:
          "bg-[var(--accent)] text-[var(--accent-text)] border border-transparent hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)]",
        secondary:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]",
        ghost:
          "bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
        danger:
          "bg-transparent text-[var(--danger)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--danger)]",
        destructive:
          "bg-transparent text-[var(--danger)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--danger)]",
        outline:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]",
        link:
          "text-[var(--accent)] underline-offset-4 hover:underline border-transparent bg-transparent active:scale-100 p-0",
      },
      size: {
        sm: "py-[6px] px-[14px] text-[length:var(--text-xs)] min-h-[32px]",
        md: "py-[9px] px-[20px] text-[length:var(--text-sm)] min-h-[38px]",
        default: "py-[9px] px-[20px] text-[length:var(--text-sm)] min-h-[38px]",
        lg: "py-[12px] px-[24px] text-[length:var(--text-base)] min-h-[44px]",
        icon: "p-[9px] size-[38px]",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            className,
          })
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin text-current" aria-hidden="true" />
        )}
        {typeof children === "string" ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
