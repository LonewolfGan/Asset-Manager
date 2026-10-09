import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowCardProps {
  className?: string;
  tag: string;
  tagColor?: string;
  title: string;
  description: string;
  ctaText: string;
  onSelect: () => void;
  graphic: React.ReactNode;
  accentBorder: string;
  glowColor: string;
}

export const WorkflowCard = React.forwardRef<HTMLDivElement, WorkflowCardProps>(
  (
    {
      className,
      tag,
      tagColor = 'text-zinc-500 dark:text-zinc-400',
      title,
      description,
      ctaText,
      onSelect,
      graphic,
      accentBorder,
      glowColor,
    },
    ref
  ) => {
    const cardAnimation = {
      rest: { y: 0 },
      hover: { y: -3 },
    };

    const graphicAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.07, rotate: 2 },
    };

    return (
      <motion.div
        ref={ref}
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="h-full cursor-pointer select-none active:scale-[0.985] transition-transform duration-150"
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <div
          className={cn(
            'group relative flex flex-col justify-between h-full min-h-[140px] sm:min-h-[215px] w-full overflow-hidden',
            'rounded-xl sm:rounded-3xl p-3.5 sm:p-6',
            // High-End Adaptive Architectural Surface
            'bg-white dark:bg-[#121216]',
            'hover:bg-white dark:hover:bg-[#16161B]',
            // Precision Hairline Borders with Dynamic Hover Accent
            'border border-zinc-200/90 dark:border-white/[0.08]',
            // Inner Specular Refraction Highlight
            'shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
            // Soft ambient shadow
            'shadow-xs hover:shadow-xl hover:shadow-black/[0.05] dark:hover:shadow-black/70',
            'transition-[border-color,background-color,box-shadow] duration-300',
            accentBorder,
            className
          )}
        >
          {/* Museum-Grade Multi-Depth Vector Graphic */}
          <motion.div
            variants={graphicAnimation}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 w-24 h-24 sm:w-48 sm:h-48 md:w-52 md:h-52 opacity-80 sm:opacity-90 dark:opacity-75 sm:dark:opacity-80 group-hover:opacity-100 pointer-events-none select-none transition-opacity"
          >
            {graphic}
          </motion.div>

          {/* Card Content Layer */}
          <div className="relative z-10 flex flex-col h-full justify-between gap-2 sm:gap-3 pointer-events-none">
            {/* Top: Micro-Tag & High-Contrast Typography */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <span
                className={cn(
                  'font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors',
                  tagColor
                )}
              >
                {tag}
              </span>
              <h4 className="text-xs sm:text-[20px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                {title}
              </h4>
              <p className="text-[11px] sm:text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[250px] sm:max-w-[270px] line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            </div>

            {/* Bottom: Nested Button-in-Button CTA Architecture */}
            <div className="pt-1 sm:pt-2">
              <span className="inline-flex items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                <span>{ctaText}</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-colors shadow-xs">
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
WorkflowCard.displayName = 'WorkflowCard';
