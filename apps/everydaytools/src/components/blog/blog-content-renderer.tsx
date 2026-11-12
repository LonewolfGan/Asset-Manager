import React from "react";
import { UserChatAvatar, AssistantChatAvatar } from "@/components/blog/blog-chat-avatars";
import type { ContentBlock } from "@/config/blog-data";
import { createHeadingIdGenerator } from "@/components/blog/blog-toc";

export interface BlogContentRendererProps {
  blocks?: ContentBlock[];
  className?: string;
}

interface FaqItem {
  question: string;
  id: string;
  answer: string;
}

interface FaqGroup {
  type: "faq_section";
  title: string;
  id: string;
  items: FaqItem[];
}

interface HeadingBlockWithId {
  type: "h2" | "h3";
  text: string;
  id: string;
}

type RenderNode =
  | Exclude<ContentBlock, { type: "h2" | "h3" }>
  | HeadingBlockWithId
  | FaqGroup;

function isFaqHeading(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("frequently asked") ||
    lower.includes("questions fréquentes") ||
    lower.includes("faq") ||
    lower.includes("foire aux questions")
  );
}

export function BlogContentRenderer({
  blocks,
  className = "",
}: BlogContentRendererProps): React.JSX.Element {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return <article className={className} />;
  }

  // Precompute heading IDs in strict document order matching extractTocItems
  const getId = createHeadingIdGenerator();
  const renderNodes: RenderNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block && block.type === "h2") {
      const h2Id = getId(block.text);
      if (isFaqHeading(block.text)) {
        const faqGroup: FaqGroup = {
          type: "faq_section",
          title: block.text,
          id: h2Id,
          items: [],
        };
        i++;
        while (i < blocks.length) {
          const nextBlock = blocks[i];
          if (nextBlock && nextBlock.type === "h3") {
            const qId = getId(nextBlock.text);
            let answerText = "";
            if (i + 1 < blocks.length && blocks[i + 1]?.type === "p") {
              answerText = (blocks[i + 1] as { type: "p"; text: string }).text;
              i += 2;
            } else {
              i += 1;
            }
            faqGroup.items.push({
              question: nextBlock.text,
              id: qId,
              answer: answerText,
            });
          } else if (nextBlock && nextBlock.type === "h2") {
            break;
          } else {
            i++;
          }
        }
        renderNodes.push(faqGroup);
      } else {
        renderNodes.push({ type: "h2", text: block.text, id: h2Id });
        i++;
      }
    } else if (block && block.type === "h3") {
      renderNodes.push({ type: "h3", text: block.text, id: getId(block.text) });
      i++;
    } else if (block) {
      renderNodes.push(block);
      i++;
    } else {
      i++;
    }
  }

  return (
    <article className={`prose-container ${className}`.trim()}>
      {renderNodes.map((node, idx) => {
        if (!node || typeof node !== "object" || !node.type) {
          return null;
        }

        if (node.type === "faq_section") {
          return (
            <section
              key={idx}
              aria-labelledby={node.id}
              data-testid="blog-faq-section"
              className="my-16 pt-4"
            >
              {/* FAQ Section Header */}
              <div className="mb-8">
                <span
                  data-testid="blog-faq-monument"
                  className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 mb-2 block"
                >
                  FAQ
                </span>
                <h2
                  id={node.id}
                  className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 scroll-mt-28 m-0"
                >
                  {node.title}
                </h2>
              </div>

              {/* Conversational Message FAQ Thread (shadcn Avatar + Message Pattern) */}
              <div className="flex flex-col items-start gap-4 max-w-2xl">
                {node.items.map((item, qIdx) => (
                  <details
                    key={qIdx}
                    name="faq-chat-group"
                    open={qIdx === 0}
                    data-testid="blog-faq-item"
                    className="group w-full"
                  >
                    {/* User Question Message Row with Stylish Vector Avatar */}
                    <summary className="cursor-pointer list-none flex items-start gap-3 select-none rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] [&::-webkit-details-marker]:hidden">
                      <UserChatAvatar name={item.question} />
                      <div className="w-fit max-w-[85%] rounded-[20px] rounded-tl-sm px-5 py-3 bg-[#eaeaee] dark:bg-[#222225] text-zinc-900 dark:text-zinc-100 text-sm sm:text-[15px] font-medium hover:bg-[#e2e2e8] dark:hover:bg-[#2c2c30] group-open:bg-[#dedee5] dark:group-open:bg-[#2a2a2e] transition-colors duration-150 active:scale-[0.98]">
                        <h3
                          id={item.id}
                          className="text-sm sm:text-[15px] font-medium m-0 leading-snug text-inherit scroll-mt-28"
                        >
                          {item.question}
                        </h3>
                      </div>
                    </summary>

                    {/* EverydayTools Assistant Response Row with Brand Accent Avatar */}
                    <div className="flex items-start gap-3 mt-3 pl-4 sm:pl-6 max-w-[95%]">
                      <AssistantChatAvatar name="EverydayTools Assistant" />
                      <div className="w-fit max-w-[88%] rounded-[22px] rounded-tl-sm bg-[var(--accent)] text-[var(--accent-text)] px-6 py-4 text-sm sm:text-[15px] leading-[1.65] shadow-xs">
                        <p className="m-0 text-inherit font-normal leading-[1.65]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        switch (node.type) {
          case "h2":
            return (
              <h2
                key={idx}
                id={node.id}
                className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-14 mb-5 scroll-mt-28 flex items-center"
              >
                <span>{node.text}</span>
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                id={node.id}
                className="font-sans text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-10 mb-3 scroll-mt-28"
              >
                {node.text}
              </h3>
            );

          case "p":
            return (
              <p
                key={idx}
                className="text-[15px] sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-5 font-normal"
              >
                {node.text}
              </p>
            );

          case "ul": {
            const items = Array.isArray(node.items) ? node.items : [];
            if (items.length === 0) return null;
            return (
              <ul
                key={idx}
                className="my-6 space-y-3 list-none pl-0 text-[15px] sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
              >
                {items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start before:content-['—'] before:text-zinc-400 dark:before:text-zinc-600 before:mr-3 before:select-none before:font-mono before:shrink-0 before:mt-0.5"
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          case "ol": {
            const items = Array.isArray(node.items) ? node.items : [];
            if (items.length === 0) return null;
            return (
              <ol key={idx} className="my-8 space-y-4 list-none pl-0" role="list">
                {items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-4 text-[15px] sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200"
                  >
                    <span
                      className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 w-6 shrink-0 pt-1 select-none"
                      aria-hidden="true"
                    >
                      {String(itemIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-normal leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            );
          }

          case "callout":
            return (
              <div
                key={idx}
                data-slot="callout"
                data-testid="blog-callout"
                className="my-10 pl-6 sm:pl-8 border-l-2 border-zinc-900 dark:border-zinc-200 text-[15px] sm:text-[16px] leading-relaxed text-zinc-800 dark:text-zinc-200 font-normal"
              >
                <p className="m-0 leading-relaxed font-normal text-zinc-800 dark:text-zinc-200">
                  {node.text}
                </p>
              </div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}
