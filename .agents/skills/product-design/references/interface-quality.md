# Interface Quality Reference

Rules for layout, hierarchy, and component selection.

## Guidelines
- **Typography over Cards**: Never wrap simple text/values in bordered gray boxes (`bg-muted/50 border`). Use clean centered typography, whitespace, and font weights.
- **Radio vs Select**: Use Radio buttons instead of a Select dropdown when there are 2 or 3 static options. All choices stay visible without an extra tap/click.
- **Inline Disclosure vs Modals**: Prefer collapsible accordion/disclosure sections before creating a modal dialog. Modals interrupt flow; use them only for blocking destructive or critical operations.
- **Action vs Navigation**: Use `<button>` for triggers/mutations and `<a>`/`<Link>` for navigation. Never place click handlers on raw `<div>` tags.
- **No Nested Modals**: Never open a modal on top of another modal. Focus management, backdrop layering, and keyboard navigation break.
