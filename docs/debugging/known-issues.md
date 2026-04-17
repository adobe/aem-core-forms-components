# Known Issues & Debugging Patterns

A catalog of resolved issues, root causes, and reusable debugging patterns for AEM Core Forms Components. Organized by area — add new entries under the relevant section.

---

## Clientlibs

### ES6 + YUI Minification Breakage
**Symptom:** JS errors in authoring mode — `"Class constructors cannot be invoked without 'new'"`. Error does not point to minification.
**Root cause:** AEM's YUI compressor cannot handle ES6+ (`class`, `static`, `#private`, `extends`). Minified output is silently broken.
**Fix:** Add `jsProcessor="[default:none,min:none]"` to the clientlib `.content.xml`. Then rebuild cache at `/libs/granite/ui/content/dumplibs.rebuild.html` — AEM does not auto-invalidate cached minified output.
**Debug steps:** Browser console → compare `.min.js` vs source → `grep -r "jsProcessor" ui.af.apps/` → check for ES6 in affected JS.

---

## i18n / Localization

<!-- Add entries here -->

---

## Validation

<!-- Add entries here -->

---

## Navigation (Wizard / Tabs / Accordion)

<!-- Add entries here -->

---

## File Upload

<!-- Add entries here -->

---

## Authoring Dialogs

<!-- Add entries here -->

---

## Sling Models / JSON Export

<!-- Add entries here -->

---

## Submit Actions

<!-- Add entries here -->

---

## Form Data Model (FDM)

<!-- Add entries here -->

---

## OSGi / Bundle Issues

<!-- Add entries here -->
