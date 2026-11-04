# css-to-theme-content-xml

Reverse-engineers AEM Adaptive Forms `_cq_styleConfig`/`_cq_themeConfig` `content.xml` from CSS
(e.g. CSS produced by a form-styling assistant, or hand-written theme CSS). Works as a skill for
both **Cursor** and **Claude Code** — see "Where this lives" below.

## Files

| File | Purpose |
|---|---|
| `SKILL.md` | The skill itself — full workflow, inheritance rules, encoding rules, validation checklist. Read this first. |
| `component-selectors.md` | CSS selector → XML node/id mapping, per component. |
| `config-file-index.md` | Index of all 32 `_cq_styleConfig` + 3 `_cq_themeConfig` files in this repo, by component. |
| `CURSOR-DIFF.md` | Changelog of every fix made to `scripts/css_to_theme_xml.py` since the original PR, with the reason for each. |
| `../../scripts/css_to_theme_xml.py` | The associated tool (see below) — repo-root `scripts/`, not inside this folder, to match this repo's existing `scripts/` convention. |

## Usage

1. Point the agent (Cursor or Claude) at a CSS file/selection and ask it to generate `content.xml`.
   It follows `SKILL.md`'s workflow: identify components from selectors → read the *actual*
   `_cq_styleConfig`/`_cq_themeConfig` template file for that component (source of truth) →
   generate XML matching that template's structure.
2. Optionally run the bundled script first for a first-pass draft:
   ```
   python3 scripts/css_to_theme_xml.py path/to/theme.css > content.xml
   ```
   The script implements the `theme.structure` single-file output format documented in `SKILL.md`.
   It prints `NOTE:` lines to stderr whenever it drops or skips something it can't represent
   (see "Known limitations" below) — always check stderr, not just stdout.
3. Either way, **verify the output against the Validation Checklist at the bottom of `SKILL.md`**
   before treating it as final. The script is a draft generator, not a substitute for reading the
   real template files.

## Where this lives

Duplicated identically at both:
- `.cursor/skills/css-to-theme-content-xml/`
- `.claude/skills/css-to-theme-content-xml/`

so both tools discover it natively. If you edit the skill, apply the change to both copies (or
diff them before merging a PR) — there's no symlink or build step keeping them in sync.

## Coverage — what's been verified vs. inherited as-is

The script's `SELECTOR_MAP` covers every documented component. Testing so far has exercised:
**textinput, dropdown, emailinput, telephoneinput, button, radiobutton, title, form (container),
panel label** — including labels, error messages, mandatory-asterisk states, and viewport
(`phone`/`tablet`) breakpoints — against real, non-trivial theme CSS with `:is()` grouping, CSS
custom properties, and accessibility media queries.

**Not yet exercised against real CSS:** checkbox, checkboxgroup, switch, accordion, tabsontop,
verticaltabs, wizard, image, fileinput, recaptcha, hcaptcha, footer, pageheader. Their
`SELECTOR_MAP` entries are carried over from the original PR unchanged — they may have the same
class of bugs (comment-adjacency, `:is()` grouping, quoted attributes, etc.) that were found and
fixed for the tested components, just not yet confirmed one way or the other.

## Known limitations (by design, not bugs)

- **`color-mix()`, `url()`, `gradient()`** — no bracket-format equivalent. Dropped with a stderr
  note; use a literal color value or a manual `cssOverride` instead.
- **Feature/preference `@media` queries** (`prefers-reduced-motion`, `forced-colors`,
  `prefers-color-scheme`, etc.) — `_cq_styleConfig` only has `default`/`phone`/`tablet` buckets.
  Skipped with a stderr note; keep these in the clientlib CSS instead.
- **`::placeholder`, `.radiobutton__option-label`, `.text__label`** — no documented node id in
  `component-selectors.md`/`config-file-index.md`. Left unmapped rather than guessed; resolving
  these needs the actual `_cq_styleConfig` template file for that component.
