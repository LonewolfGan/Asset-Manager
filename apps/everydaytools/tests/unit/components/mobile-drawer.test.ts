import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MobileDrawer } from "@/components/nav/MobileDrawer";
import { LocaleProvider } from "@/contexts/locale-context";

describe("MobileDrawer Component Preservation", () => {
  it("renders mobile drawer with exact layout when open", () => {
    const html = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(MobileDrawer, {
          open: true,
          onClose: () => {},
          onOpenSearch: () => {},
          currentPath: "/",
        })
      )
    );

    expect(html).toContain("EverydayTools");
    expect(html).toContain("Blog");
    expect(html).toContain('width:min(300px, 88vw)');
  });

  it("returns null when open is false", () => {
    const html = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(MobileDrawer, {
          open: false,
          onClose: () => {},
          onOpenSearch: () => {},
          currentPath: "/",
        })
      )
    );

    expect(html).toBe("");
  });
});
