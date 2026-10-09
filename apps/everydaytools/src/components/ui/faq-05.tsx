"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  id?: string;
  q: string;
  a: string;
}

export interface Faq05Props {
  faqs?: readonly FaqItem[];
  tag?: string;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_FAQS: readonly { id: string; q: string; a: string }[] = [
  {
    id: "item-1",
    q: "Is there a free plan?",
    a: "Yes. Start for free and explore the full dashboard, no card required. Upgrade only when you need more seats or higher limits.",
  },
  {
    id: "item-2",
    q: "Can I change plans later?",
    a: "Anytime. Move up or down from the billing page and the change takes effect on your next cycle. Downgrades keep your data intact.",
  },
  {
    id: "item-3",
    q: "How is my data kept safe?",
    a: "Everything is encrypted in transit and at rest. Access is scoped to members of your workspace, and you control who gets in.",
  },
  {
    id: "item-4",
    q: "Do you offer team accounts?",
    a: "Yes. Invite teammates, set roles, and share workspaces. Billing is per seat, so you only pay for the people who use it.",
  },
  {
    id: "item-5",
    q: "What if I need help?",
    a: "Reach out anytime. Most questions get a reply within a day, and there's a searchable guide for the common ones.",
  },
];

const Faq05 = ({
  faqs,
  tag = "faq",
  title = "Questions, answered.",
  description = "The things people ask most often. Still stuck? Reach out and we’ll walk you through it.",
  className = "",
}: Faq05Props) => {
  const data = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <section
      data-slot="faq"
      className={`w-full bg-transparent py-14 md:py-24 ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Intro */}
        <div
          data-slot="faq-intro"
          className="md:col-span-5 flex flex-col justify-start gap-4 md:sticky md:top-24"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium select-none">
            {tag}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal md:font-medium leading-[1.08] tracking-tight text-foreground select-none"
            style={{
              fontFamily:
                '"Bricolage Grotesque", "Outfit", "Space Grotesk", system-ui, sans-serif',
            }}
          >
            {title}
          </h2>
          <p className="max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Column: Accordion list */}
        <div
          data-slot="faq-list"
          className="md:col-span-7 flex flex-col justify-center"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
          >
            {data.map((item, idx) => {
              const itemId = item.id || `item-${idx}`;
              return (
                <AccordionItem
                  key={itemId}
                  value={itemId}
                  className="border-b border-border/50 py-1"
                >
                  <AccordionTrigger className="text-left font-medium text-base sm:text-lg hover:no-underline py-5 text-foreground hover:text-foreground/80 transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq05;
export { Faq05 };
