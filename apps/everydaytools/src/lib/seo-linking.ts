import { SEO_TOOLS, type ToolSeoEntry, type Locale } from "../config/tools-seo-data";
import { BLOG_POSTS, type BlogPost } from "../config/blog-data";

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns all blog posts that provide step-by-step guidance or practical workflows
 * for a specific tool internal slug.
 */
export function getBlogPostsForTool(internalSlug: string): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.relatedToolSlug === internalSlug);
}

/**
 * Returns all tools that are directly referenced or related to a specific blog post slug.
 */
export function getRelatedToolsForBlogPost(postSlug: string): ToolSeoEntry[] {
  const post = BLOG_POSTS.find((p) => p.slug.en === postSlug || p.slug.fr === postSlug);
  if (!post || !post.relatedToolSlug) return [];

  const mainTool = SEO_TOOLS.find((t) => t.internalSlug === post.relatedToolSlug);
  if (!mainTool) return [];

  const related = [mainTool];
  for (const relSlug of mainTool.relatedTools) {
    const t = SEO_TOOLS.find((tool) => tool.internalSlug === relSlug);
    if (t && !related.some((item) => item.internalSlug === t.internalSlug)) {
      related.push(t);
    }
  }

  return related;
}

/**
 * Builds a semantic HTML section displaying practical step-by-step guides and tutorials
 * related to the current tool. Adheres strictly to the copywriting skill guidelines
 * (falsifiable claims, descriptive anchors, zero AI buzzwords).
 */
export function buildGuidesSectionHtml(tool: ToolSeoEntry, locale: Locale): string {
  const posts = getBlogPostsForTool(tool.internalSlug);
  if (!posts || posts.length === 0) return "";

  const sectionLabel = locale === "fr" ? "Guides & Tutoriels Détaillés" : "Practical Guides & In-Depth Tutorials";
  const sectionIntro = locale === "fr"
    ? "Consultez nos guides techniques complets pour maîtriser chaque étape de traitement, comprendre les formats et optimiser vos fichiers sans risque d'altération."
    : "Read our comprehensive technical guides to master each step of file conversion, understand format specifications, and preserve document fidelity.";

  const guideCards = posts
    .map((post) => {
      const href = `/${locale}/blog/${post.slug[locale]}`;
      const title = post.title[locale];
      const desc = post.description[locale];
      const readingMinutes = post.readingMinutes;
      const readLabel = locale === "fr" ? "min de lecture" : "min read";

      return `
      <article class="guide-card">
        <div class="guide-meta font-mono">
          <span>${readingMinutes} ${readLabel}</span>
        </div>
        <h3 class="guide-card-title">
          <a href="${href}" class="guide-link">${escHtml(title)}</a>
        </h3>
        <p class="guide-card-desc">${escHtml(desc)}</p>
      </article>`.trim();
    })
    .join("\n");

  return `
<section class="section guides-section" aria-label="${escHtml(sectionLabel)}">
  <p class="section-label">${escHtml(sectionLabel)}</p>
  <p class="section-subtext">${escHtml(sectionIntro)}</p>
  <div class="guides-grid">
    ${guideCards}
  </div>
</section>`.trim();
}

/**
 * Builds the related tools section with valid localized reciprocal internal links.
 */
export function buildRelatedToolsSectionHtml(tool: ToolSeoEntry, locale: Locale): string {
  if (!tool.relatedTools || tool.relatedTools.length === 0) return "";
  const relatedHeader = locale === "fr" ? "Outils connexes" : "Related Tools";

  const cards = tool.relatedTools
    .map((internalSlug) => {
      const related = SEO_TOOLS.find((t) => t.internalSlug === internalSlug);
      if (!related) return "";
      const href = `/${locale}/${related.slugs[locale]}`;
      const name = related.h1[locale];
      return `<a href="${href}" class="related-card"><span class="related-card-name">${escHtml(name)}</span></a>`;
    })
    .filter(Boolean)
    .join("\n");

  if (!cards) return "";

  return `
<section class="section" aria-label="${escHtml(relatedHeader)}">
  <p class="section-label">${escHtml(relatedHeader)}</p>
  <div class="related-grid">
    ${cards}
  </div>
</section>`.trim();
}
