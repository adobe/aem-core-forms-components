# aem-core-forms-components

AEM Core Forms Components — Adaptive Forms v2 component library.

## Key References

### Architecture
- **Project overview**: [`docs/architecture/overview.md`](docs/architecture/overview.md)
  Module structure, Java model hierarchy, form JSON model, IT infrastructure, Cypress patterns, JCR content XML patterns.
- **Runtime internals**: [`docs/architecture/runtime-internals.md`](docs/architecture/runtime-internals.md)
  Deep dive into the form initialization pipeline, repeatable container/InstanceManager mechanics, FT_FORMS-24358 items-array export, common crash signatures, and debugging checklist.
- **Component versioning**: [`docs/architecture/component-versioning.md`](docs/architecture/component-versioning.md)
  When a change needs a new component version (`v1` → `v2`) vs. a fix-in-place, and the full checklist of what to update when bumping a version (clientlib self-containment, `_cq_dialog`/`_cq_styleConfig` inheritance, `pom.xml`, runtime clientlib embed lists, etc.).

### E2E Testing
- **Feature Toggle Tests**: [`docs/e2e-testing/feature-toggles.md`](docs/e2e-testing/feature-toggles.md)
  How to add Cypress e2e tests for new feature toggles: OSGi config changes, system property wiring, and the isLatestAddon + fetchFeatureToggles test pattern.
wfdfdsfdsdfs
