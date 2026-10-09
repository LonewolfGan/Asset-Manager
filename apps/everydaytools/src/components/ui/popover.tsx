import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverArrow = PopoverPrimitive.Arrow;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    hideArrow?: boolean;
  }
>(({ className, align = "center", sideOffset = 8, children, hideArrow = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl p-4 text-xs font-sans outline-none shadow-xl",
        "border border-zinc-200/80 dark:border-white/10",
        "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    >
      {children}
      {!hideArrow && (
        <PopoverPrimitive.Arrow className="fill-white dark:fill-zinc-900" />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export interface ActionPopoverProps {
  /** Trigger element wrapped by the popover trigger */
  trigger: React.ReactNode;
  /** Content rendered inside the popover overlay */
  content: React.ReactNode;
  /** Alignment relative to trigger */
  align?: "start" | "center" | "end";
  /** Placement side */
  side?: "top" | "bottom" | "left" | "right";
  /** Offset in px from trigger */
  sideOffset?: number;
  /** Popover content class name */
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state change callback */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Ergonomic, self-contained shadcn Popover wrapper for quick composition.
 */
export const ActionPopover: React.FC<ActionPopoverProps> = ({
  trigger,
  content,
  align = "center",
  side = "bottom",
  sideOffset = 6,
  className,
  open,
  onOpenChange,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} side={side} sideOffset={sideOffset} className={className}>
        {content}
      </PopoverContent>
    </Popover>
  );
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
