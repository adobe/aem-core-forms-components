---
applyTo: "**/*.js"
---

# JavaScript Review Rules

## General
- ES6+ syntax required: `const`/`let` (never `var`), arrow functions, template literals
- No jQuery for new code — use vanilla JavaScript
- Always null-check DOM elements before accessing properties or methods
- Event listeners should use event delegation where possible
- All client-side code must be wrapped in AEM clientlib categories

## Adaptive Forms Specific
- Custom functions must follow `@aemforms/af-core` API patterns and function registry
- Form model changes must go through the Adaptive Forms rule engine — no direct DOM manipulation of form state
- Client-side validation must complement server-side validation, never replace it
- All custom functions must handle null/undefined input gracefully

## Internationalization
- All user-facing strings must use `Granite.I18n.get()` — no hardcoded strings
