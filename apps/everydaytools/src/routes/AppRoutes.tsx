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
  Changelog,
  Privacy,
  Terms,
  SecurityPage,
  LegalNotice,
  Cookies,
  Contact,
  ServerError,
  AccessDenied,
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
      <Route path="/fr" component={Home} />
      <Route path="/en" component={Home} />

      {/* Blog routes */}
      <Route path="/en/blog" component={BlogIndex} />
      <Route path="/fr/blog" component={BlogIndex} />
      <Route path="/en/blog/:slug" component={BlogPost} />
      <Route path="/fr/blog/:slug" component={BlogPost} />

      {/* Changelog routes */}
      <Route path="/changelog" component={Changelog} />
      <Route path="/en/changelog" component={Changelog} />
      <Route path="/fr/changelog" component={Changelog} />

      {/* Legal, Support & Static Essential Pages */}
      <Route path="/contact" component={Contact} />
      <Route path="/en/contact" component={Contact} />
      <Route path="/fr/contact" component={Contact} />

      <Route path="/privacy" component={Privacy} />
      <Route path="/en/privacy" component={Privacy} />
      <Route path="/fr/privacy" component={Privacy} />

      <Route path="/terms" component={Terms} />
      <Route path="/en/terms" component={Terms} />
      <Route path="/fr/terms" component={Terms} />

      <Route path="/security" component={SecurityPage} />
      <Route path="/en/security" component={SecurityPage} />
      <Route path="/fr/security" component={SecurityPage} />

      <Route path="/legal-notice" component={LegalNotice} />
      <Route path="/en/legal-notice" component={LegalNotice} />
      <Route path="/fr/legal-notice" component={LegalNotice} />
      <Route path="/mentions-legales" component={LegalNotice} />
      <Route path="/fr/mentions-legales" component={LegalNotice} />
      <Route path="/en/mentions-legales" component={LegalNotice} />

      <Route path="/cookies" component={Cookies} />
      <Route path="/en/cookies" component={Cookies} />
      <Route path="/fr/cookies" component={Cookies} />
      <Route path="/politique-cookies" component={Cookies} />
      <Route path="/fr/politique-cookies" component={Cookies} />
      <Route path="/en/politique-cookies" component={Cookies} />

      <Route path="/403" component={AccessDenied} />
      <Route path="/en/403" component={AccessDenied} />
      <Route path="/fr/403" component={AccessDenied} />
      <Route path="/access-denied" component={AccessDenied} />
      <Route path="/en/access-denied" component={AccessDenied} />
      <Route path="/fr/access-denied" component={AccessDenied} />

      <Route path="/500" component={ServerError} />
      <Route path="/en/500" component={ServerError} />
      <Route path="/fr/500" component={ServerError} />

      {/* Locale-aware SEO routes */}
      <Route path="/en/:slug" component={LocaleToolRoute} />
      <Route path="/fr/:slug" component={LocaleToolRoute} />
      <Route path="/tools/:slug" component={LocaleToolRoute} />

      {/* Dynamic Tools Routes mapped directly from TOOL_COMPONENTS registry */}
      {Object.entries(TOOL_COMPONENTS).map(([slug, Comp]) => (
        <Route key={slug} path={`/${slug}`} component={Comp} />
      ))}

      <Route component={NotFound} />
    </Switch>
  );
}
