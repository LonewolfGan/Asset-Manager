import React, { lazy, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/hooks/use-locale";
import {
  SLUG_MAP_EN_TO_INTERNAL,
  SLUG_MAP_FR_TO_INTERNAL,
} from "@/config/tools-seo-data";
import {
  Home,
  BlogIndex,
  BlogPost,
  Privacy,
  Terms,
  SecurityPage,
  TOOL_COMPONENTS,
} from "./tool-components";

export function PageLoader() {
  return (
    <div style={{ padding: "40px var(--tool-padding-x) 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div className="skeleton" style={{ width: 36, height: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 6, height: 6, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 70, height: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 6, height: 6, borderRadius: "50%" }} />
        <div className="skeleton" style={{ width: 110, height: 12, borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: "55%", height: 36, borderRadius: 8, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: "80%", height: 14, borderRadius: 4, marginBottom: 6 }} />
      <div className="skeleton" style={{ width: "60%", height: 14, borderRadius: 4, marginBottom: 32 }} />
      <div className="skeleton" style={{ width: "100%", height: 180, borderRadius: 14 }} />
      <div className="skeleton" style={{ width: "100%", height: 46, borderRadius: 14, marginTop: 16 }} />
    </div>
  );
}

export function LocaleToolRoute({ params }: { params: { slug: string } }) {
  const [location] = useLocation();
  const { locale, setLocale } = useLocale();
  const slug = params?.slug ?? "";

  useEffect(() => {
    if (location.startsWith("/fr/") && locale !== "FR") {
      setLocale("FR");
    } else if (location.startsWith("/en/") && locale !== "EN") {
      setLocale("EN");
    }
  }, [location, locale, setLocale]);

  const internalSlug =
    SLUG_MAP_EN_TO_INTERNAL[slug] ?? SLUG_MAP_FR_TO_INTERNAL[slug] ?? (TOOL_COMPONENTS[slug] ? slug : null);
  const Comp = internalSlug ? TOOL_COMPONENTS[internalSlug] : null;
  if (!Comp) return <NotFound />;
  return <Comp />;
}

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Blog routes */}
      <Route path="/en/blog" component={BlogIndex} />
      <Route path="/fr/blog" component={BlogIndex} />
      <Route path="/en/blog/:slug" component={BlogPost} />
      <Route path="/fr/blog/:slug" component={BlogPost} />

      {/* Locale-aware SEO routes */}
      <Route path="/en/:slug" component={LocaleToolRoute} />
      <Route path="/fr/:slug" component={LocaleToolRoute} />
      <Route path="/tools/:slug" component={LocaleToolRoute} />

      <Route path="/break-test" component={lazy(() => import("@/pages/break-test"))} />

      {/* Dynamic Tools Routes mapped directly from TOOL_COMPONENTS registry */}
      {Object.entries(TOOL_COMPONENTS).map(([slug, Comp]) => (
        <Route key={slug} path={`/${slug}`} component={Comp} />
      ))}

      {/* Legal & Static */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/security" component={SecurityPage} />

      <Route component={NotFound} />
    </Switch>
  );
}
