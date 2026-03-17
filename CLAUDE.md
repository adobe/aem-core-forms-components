# aem-core-forms-components

AEM Core Forms Components — Adaptive Forms v2 component library.

## Key References

### Architecture
- **Project overview**: [`docs/architecture/overview.md`](docs/architecture/overview.md)
  Module structure, Java model hierarchy, form JSON model, IT infrastructure, Cypress patterns, JCR content XML patterns.
- **Runtime internals**: [`docs/architecture/runtime-internals.md`](docs/architecture/runtime-internals.md)
  Deep dive into the form initialization pipeline, repeatable container/InstanceManager mechanics, FT_FORMS-24358 items-array export, common crash signatures, and debugging checklist.

### E2E Testing
- **Feature Toggle Tests**: [`docs/e2e-testing/feature-toggles.md`](docs/e2e-testing/feature-toggles.md)
  How to add Cypress e2e tests for new feature toggles: OSGi config changes, system property wiring, and the isLatestAddon + fetchFeatureToggles test pattern.
