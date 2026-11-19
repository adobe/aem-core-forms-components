# Diff from the Cursor skill (source of truth: aem-core-forms-components PR #1831)

This skill was ported from `.cursor/skills/css-to-theme-content-xml`. Keep this file updated
whenever the Claude copy intentionally diverges from that PR, so a future sync/merge knows
what's a deliberate fix vs. accidental drift.

**Unchanged (still byte-identical to the PR):** `SKILL.md`, `component-selectors.md`, `config-file-index.md`.

**Changed:** `scripts/css_to_theme_xml.py` — all fixes below, found by running the script against
real `/cc-form-styler` output, which the skill is meant to consume.

| Change | Why |
|---|---|
| Strip `/* comments */` before parsing | A selector right after a comment (e.g. `/* Button */\n.cmp-adaptiveform-button`) matched nothing — the whole rule silently vanished. |
| Expand `:is(a, b, c)` / `:where(...)` per alternative, preserving the trailing state | Naive comma-split had no paren awareness: the first list item always broke (kept a leading `:is(`), the last always broke (kept a trailing `)`/`:state`), and middle items lost their real state and landed as `default`. |
| Resolve `var(--x)` from `:root` before further processing | Values were left as literal `var(--x)` strings — colors never converted to `rgb()`, since cc-form-styler emits colors as CSS custom properties. |
| Normalize quoted attribute selectors (`[data-cmp-valid='false']` → `=false`) before matching | `SELECTOR_MAP` only recognized the unquoted form; every error/required-state rule (quoted, per SKILL.md's own documented syntax) matched nothing. |
| Split `@media` handling: viewport (`max-width`/`min-width` → `phone_x0023_*`/`tablet_x0023_*`) vs. feature/preference (`prefers-reduced-motion`, `forced-colors`, etc. → skipped with a stderr note) | Old regex only removed the first inner rule of a multi-rule `@media` block, leaking the rest as unscoped "default" CSS. Feature queries have no bucket in `_cq_styleConfig` at all — they must stay in the clientlib CSS, not content.xml. |
| Merge rules that resolve to the same node + state by property, instead of overwriting | Two selectors resolving to the same `af2_id`/state (e.g. `.cmp-adaptiveform-button` wrapper and `.cmp-adaptiveform-button__widget`) is the norm per `component-selectors.md`'s "widgetAndText" pattern — the later rule was silently discarding the earlier one's properties entirely. |
| XML-escape bracket values before printing (`"` → `&quot;`, `&` → `&amp;`, `<` → `&lt;`) | A value containing a literal quote (e.g. `font-family: ... "Segoe UI" ...`) produced invalid, unparsable XML. |
| Fix multi-value padding/margin shorthand expansion (`padding: 1rem 2rem 3rem` → correct per-side split) | Old code duplicated the whole shorthand string onto all four sides instead of splitting it per CSS shorthand rules. |
| Drop `color-mix()` / `url()` / `gradient` values with a stderr note instead of silently keeping or silently losing them | These have no bracket-format equivalent. Previously either silently dropped with no trace, or (when wrapped in `var()`) leaked the literal unresolved function string into the output. |
| Added `SELECTOR_MAP` entries for Pattern A `__label`/`__label-container`/`__questionmark`/`__shortdescription`/`__longdescription`/`__errormessage`, the compound `[data-cmp-valid=...] .__widget` error/success form, and the compound `[data-cmp-required=true] .__label::after` mandatory-asterisk form (plus the radiobutton equivalents) | `SELECTOR_MAP` only ever covered the root/`__widget` selectors — every label, error-message, and compound data-attribute rule (all standard, all documented in `component-selectors.md`'s own Pattern A/C tables) silently produced nothing. |
| Generalized `border` shorthand expansion to classify tokens by shape (style keyword / color / width) instead of requiring the literal word `"solid"` | `border: none` (very common — used to reset default browser borders on buttons, radiogroups, fieldsets) was left as a single unexpanded `border:none` property while `border: 1px solid #666` was fully expanded — inconsistent, and violates SKILL.md's "shorthands must be expanded" rule. Now both expand consistently (`border-style:none` / `border-style:solid,border-*-width:...,border-color:...`). |

**Not fixed / known limitations:**
- `color-mix()`-based hover/active colors have no bracket-format representation at all — the reference CSS would need a literal hex/rgb value, or a manual `cssOverride`, to appear in content.xml.
- `::placeholder`, `.cmp-adaptiveform-radiobutton__option-label`, and `.cmp-adaptiveform-text__label` have no documented node id in the bundled reference docs — left unmapped rather than guessed. Resolving these needs the actual `_cq_styleConfig` template files (per SKILL.md's "never guess, resolve from the real file" rule), which this repo doesn't have local access to.
