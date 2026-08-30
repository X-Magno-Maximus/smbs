# PURGE quarantine

This folder preserves UI fragments removed from active execution during the 2026-08-30 repository action audit.

Removal rule: a visible interactive control must have a verified destination, action, event handler, or form behavior that is relevant to the SMB dashboard. Static content, layout, accessibility metadata, and styling are evaluated for relevance rather than incorrectly requiring an event on every source line.

Nothing in this directory is loaded by `index.html` or `accounting.html`.

See `nonfunctional-controls.html` for the exact quarantined fragments and their reasons.
