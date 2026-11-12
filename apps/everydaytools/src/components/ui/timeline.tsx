"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export interface TimelineEntry {
  title: string;
  version: string;
  date: string;
  isoDate: string;
  content: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineEntry[];
}

export function Timeline({ data }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full font-ui">
      <div ref={ref} className="relative w-full pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            data-testid="changelog-item"
            className="flex flex-col md:flex-row justify-start pt-12 md:pt-16 md:gap-10"
          >
            {/* Sticky Left Rail Node & Date Column */}
            <div className="sticky flex flex-col md:flex-row items-start md:items-center top-28 z-20 self-start md:w-64 shrink-0">
              {/* Rail Circle Node */}
              <div className="h-9 w-9 absolute -left-[17px] rounded-full bg-background border border-border/80 flex items-center justify-center shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-foreground/60 border border-border" />
              </div>

              {/* Version & Date (Desktop) */}
              <div className="hidden md:flex flex-col pl-10 space-y-1">
                <span className="font-mono text-sm font-semibold text-foreground tracking-tight">
                  {item.version}
                </span>
                <time dateTime={item.isoDate} className="font-mono text-xs text-muted-foreground">
                  {item.date}
                </time>
              </div>
            </div>

            {/* Right Column: Editorial Prose & Changes directly on Canvas */}
            <div className="relative pl-8 md:pl-0 pr-2 w-full space-y-4">
              {/* Mobile Header */}
              <div className="flex md:hidden items-baseline gap-2.5 mb-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {item.version}
                </span>
                <span className="text-muted-foreground/60">/</span>
                <time dateTime={item.isoDate} className="font-mono text-xs text-muted-foreground">
                  {item.date}
                </time>
              </div>

              {/* Entry Content (No Box Slop) */}
              {item.content}
            </div>
          </div>
        ))}

        {/* Vertical Rail Line with Animated Beam */}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-0 top-0 overflow-hidden w-[2px] bg-border/60 [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-foreground/80 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Timeline;
