import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { NavDropdown } from "@/components/nav/NavDropdown";
import { GROUPS } from "@/config/top-nav-groups";
import { LocaleProvider } from "@/contexts/locale-context";

describe("NavDropdown Component Preservation", () => {
  it("renders closed dropdown button with group label and arrow", () => {
    const html = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(NavDropdown, {
          group: GROUPS[0],
          isOpen: false,
          onOpen: () => {},
          onClose: () => {},
          clearTimer: () => {},
          currentPath: "/",
        })
      )
    );

    expect(html).toContain('aria-haspopup="true"');
    expect(html).toContain('aria-expanded="false"');
  });

  it("renders open dropdown with 2-column grid of tool links when open", () => {
    const html = renderToString(
      React.createElement(
        LocaleProvider,
        null,
        React.createElement(NavDropdown, {
          group: GROUPS[0],
          isOpen: true,
          onOpen: () => {},
          onClose: () => {},
          clearTimer: () => {},
          currentPath: "/pdf-merge",
        })
      )
    );

    expect(html).toContain('role="menu"');
    expect(html).toContain("/pdf-merge");
    expect(html).toContain("/pdf-split");
    expect(html).toContain('grid-template-columns:1fr 1fr');
  });
});
