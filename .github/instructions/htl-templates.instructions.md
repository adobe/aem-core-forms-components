---
applyTo: "**/*.html"
---

# HTL Template Review Rules

## Data Binding
- `data-sly-use` must reference the Sling Model INTERFACE (e.g., `com.adobe.aem.forms.core.components.models.TextInput`), never the implementation class (`*Impl`)
- Complex logic must be in the Sling Model — if an HTL expression has more than a simple property access or boolean check, flag it
- No inline JavaScript — all JS must go through clientlibs

## XSS Protection (CRITICAL)
- All dynamic content must use proper display context: `@context='html'`, `@context='text'`, `@context='uri'`
- Flag ANY use of `@context='unsafe'` as a security error — this disables XSS protection entirely
- User-generated content without explicit context defaults to text but should be explicit

## Accessibility (CRITICAL — Active remediation in progress)
- Every `<input>`, `<select>`, `<textarea>` MUST have an associated `<label for="">` or `aria-label`
- Radio button groups and checkbox groups must be wrapped in `<fieldset>` with `<legend>`
- Panels that expand/collapse must have `aria-expanded` attribute that toggles
- Error messages must be linked to their field via `aria-describedby`
- All interactive elements must be keyboard operable — check for `tabindex`, key event handlers
- Focus management: new panels/forms should focus the first visible field

## HTML Structure
- Root element must use BEM class naming: `.cmp-<componentname>`
- Child elements: `.cmp-<componentname>__<element>`
- Include `data-cmp-is` attribute for JavaScript initialization
- No hardcoded user-facing strings — use `${'key' @ i18n}` for internationalization
- Support Style System via `${properties.cssClass}`
