# Component Versioning

When a change requires a new component version (`v1` → `v2`), and what to check when bumping.

## When to bump

Bump when the change breaks a contract external code depends on:

- DOM structure (elements added/removed/reordered, class renames) that could break authored CSS or test selectors.
- JS runtime contract (clientlib category, init/attach lifecycle, public events, exported model/JSON shape).
- Authoring contract (dialog field renames that would corrupt existing authored content).

Do not bump for bug fixes, including accessibility fixes, or additive/non-breaking changes. Fix these forward in the existing version. Example: the datepicker `v1`→`v2` cycle (below) shows accessibility fixes being folded back into `v1` rather than kept as a `v2`-only fix.

## Checklist

Based on past version bumps in this repo (button/submit/reset v2, title v2, wizard v2, radiobutton v2, checkboxgroup v2, fileinput v2–v4, container v2, datepicker v2). None of these bumps completed every item below in a single commit — treat this as a review checklist, not a fixed template.

1. **New version folder**: own `.content.xml` (title suffixed `(v<N+1>)`), HTL, `README.md`. Done consistently in every past bump.
2. **Clientlib**: only needed if JS/CSS actually changed. Several past bumps (button, submit, reset, title, wizard v2) shipped no clientlib of their own and continued sharing `v1`'s. Where a clientlib was added (radiobutton, checkboxgroup, fileinput, container, datepicker v2), it was a full standalone copy — never a path into the previous version's clientlib folder.
3. **`_cq_dialog` / `_cq_design_dialog` / `_cq_styleConfig` / `_cq_template.xml`**: inherit via `sling:resourceSuperType` when unchanged (the common case). Add an own copy only where fields actually differ (e.g. fileinput v3/v4, container v2). Check `extraClientlibs`, `helpPath`, and `trackingFeature` values that hardcode a version number — these do not update via inheritance.
4. **Java model**: add `FormConstants.RT_FD_FORM_<COMPONENT>_V<N+1>` and update the Sling Model's `resourceType` array only if the exported model/JSON shape changed. Most past bumps (button, submit, reset, wizard, radiobutton, checkboxgroup, fileinput v4) did not touch Java at all — HTML/JS-only changes did not need it.
5. **`ui.af.apps/pom.xml`**: the `<replace token=".core-adaptiveform">` step controls which version is visible in the component browser. This was the step most often missed in past bumps and added later in bulk cleanup PRs — verify it explicitly rather than assuming it was done alongside the version folder.
6. **Runtime clientlib embed lists** (`ui.af.apps/.../core-forms-components-runtime-all/.content.xml`, `it/apps/.../custom-forms-components-runtime-all/.content.xml`): update only if step 2 added a new clientlib category. See the inline comment in those files for the replace-vs-add-alongside rule.
7. **IT content / examples**: update any `.content.xml` with `sling:resourceSuperType` pointing at the old version, if the new version becomes the default. This was skipped entirely in some past bumps (e.g. datepicker, throughout its `v2` add-and-removal).
8. **E2E spec**: add a Cypress spec for the new version's runtime behavior. Naming has not been fully consistent historically (`<component>v<N+1>.runtime.cy.js` in most cases; `.spec.js` in older ones).
