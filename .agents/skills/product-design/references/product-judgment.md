# Product Judgment Reference

Before designing or implementing user-facing changes, define the product decision explicitly.

## Product Decision Brief Template
- **User / Actor**: Who is interacting? (Client, Admin, Provider, System)
- **Job to be done**: What specific goal are they trying to achieve right now?
- **Target Object**: What entity is being created, modified, viewed, or deleted?
- **Action & Scope**: Is it a local draft edit, a global status change, or a destructive mutation?
- **Consequence & Reversibility**: Can this action be undone? What downstream entities are affected?
- **Permissions & Roles**: Can all roles perform this, or only specific authorized users?
- **Success Signal**: How does the user know the operation succeeded without ambiguity?
- **Non-Goals**: What explicitly is NOT being addressed in this intervention?
