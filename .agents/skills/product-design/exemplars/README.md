# Shipped Exemplars & Anti-Patterns

Documented decisions worth repeating from shipped PRs, and mistakes to avoid.

## Exemplars
- **Destructive Modal**: Clear title ("Delete Workspace 'Production'"), description detailing lost resources, `Verb + Noun` action button ("Delete Workspace"), and explicit cancellation option.
- **Settings Form**: Auto-save on blur with subtle saving status indicator, keyboard shortcut support (Cmd+S / Ctrl+S), preserving draft input on validation failure.

## Anti-Patterns to Avoid
- **Bare Verbs**: CTAs labeled "Confirm", "OK", "Submit", or "Delete" without target noun.
- **Nested Dialogs**: Opening a secondary modal over an existing active modal backdrop.
- **Grey Border Cards for Text**: Wrapping plain text values in `bg-muted/50 border` boxes.
