"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    hideArrow?: boolean;
  }
>(({ className, sideOffset = 8, children, hideArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md px-2.5 py-1 text-xs font-medium select-none shadow-md",
        "bg-zinc-900 text-zinc-100 border border-zinc-800",
        "dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200/80",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-1.5 data-[side=left]:slide-in-from-right-1.5 data-[side=right]:slide-in-from-left-1.5 data-[side=top]:slide-in-from-bottom-1.5",
        "origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    >
      {children}
      {!hideArrow && (
        <TooltipPrimitive.Arrow className="fill-zinc-900 dark:fill-zinc-100" />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface ActionTooltipProps {
  /** The tooltip content text or element */
  label?: React.ReactNode;
  /** The trigger element wrapped by the tooltip */
  children: React.ReactNode;
  /** Positioning side */
  side?: "top" | "bottom" | "left" | "right";
  /** Alignment relative to the trigger */
  align?: "start" | "center" | "end";
  /** Pixel offset from the trigger */
  sideOffset?: number;
  /** Delay before displaying the tooltip in ms */
  delayDuration?: number;
  /** Custom content CSS classes */
  className?: string;
  /** If true, the tooltip will not open */
  disabled?: boolean;
  /** Tooltip open state controlled externally */
  open?: boolean;
  /** Callback for open state change */
  onOpenChange?: (open: boolean) => void;
  /** If true, hide arrow */
  hideArrow?: boolean;
}

/**
 * High-performance, ergonomic wrapper around shadcn Tooltip.
 * Eliminates repetitive Radix boilerplate for buttons and controls.
 */
export const ActionTooltip = React.forwardRef<
  any,
  ActionTooltipProps & React.HTMLAttributes<HTMLElement>
>(({
  label,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  delayDuration,
  className,
  disabled = false,
  open,
  onOpenChange,
  hideArrow = false,
  ...props
}, ref) => {
  if (disabled || !label) {
    return <>{children}</>;
  }

  return (
    <Tooltip delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild ref={ref} {...props}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} sideOffset={sideOffset} className={className} hideArrow={hideArrow}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
});
ActionTooltip.displayName = "ActionTooltip";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow };
