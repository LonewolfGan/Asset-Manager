# State Resilience Reference

Design every reachable state beyond the happy path.

## Required Reachable States
1. **Loading State**: Keep button/container dimensions stable. Use spinner/skeleton without layout shift.
2. **Empty State**: Provide clear context and a primary call-to-action to resolve the empty state.
3. **Sparse State**: 1-2 items displayed cleanly without stretched or broken grid layouts.
4. **Populated State**: Full data displayed cleanly with overflow handling.
5. **Validation State**: Show inline, recoverable error messages next to relevant input fields while preserving typed input.
6. **Error State**: Actionable error messages explaining what went wrong and how to recover or retry.
7. **Permission State**: Disabled or hidden controls for unauthorized users, with tooltip/explanation if disabled.
8. **Destructive State**: Explicit confirmation step specifying the exact object name (e.g. "Delete Project 'Anubis'").
