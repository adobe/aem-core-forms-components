# AEM Core Forms Components — Copilot Review Instructions

## Project Context
This is Adobe's open-source AEM Core Forms Components repository. The tech stack is Java (Sling Models, OSGi services), HTL (HTML Template Language), JavaScript, Maven, and JCR content packages. Components follow the AEM Core Components architecture with the Proxy + Delegation pattern.

## Review Philosophy
- Only comment when you have HIGH CONFIDENCE (>80%) that an issue exists
- Focus on violations of the specific standards below, not generic style preferences
- Do NOT flag formatting issues — we use `eclipse-formatter.xml` and `mvn -Pformat-code` for that
- Be specific: reference which standard is violated and how to fix it
- Prioritize: security > accessibility > architectural patterns > code quality > suggestions

## CI Pipeline Context
Our CI already runs: Maven build, code formatting check (eclipse-formatter.xml), `it.only`/`describe.only` detection in test files, and base branch auto-sync. Do NOT flag issues that CI will catch.

---

## Java / Sling Model Standards

### Annotations (CRITICAL — flag every violation)
- Use `@ValueMapValue` for JCR property injection, NEVER generic `@Inject` — @Inject is ambiguous and resolves from multiple sources unpredictably
- Sling Models MUST have `@Model` annotation with explicit `adaptables`, `adapters`, and `resourceType`
- Every Sling Model must implement an interface (adapter pattern) — never expose impl class to HTL
- Use `@PostConstruct` for init logic, never constructors
- Use `DefaultInjectionStrategy.OPTIONAL` only when properties are genuinely optional

### Architecture Patterns
- Proxy Component Pattern is mandatory: content `sling:resourceType` must NEVER contain version numbers
- Sling Model implementations go in `*.internal.models.*` package — internal packages must NOT be OSGi-exported
- Use delegation via `@Self @Via(type = ResourceSuperType.class)` when extending core components, not class inheritance
- Service user mappings for resource resolver access — NEVER `getAdministrativeResourceResolver()` (deprecated, security risk)

### Error Handling
- No empty catch blocks — log with context (SLF4J Logger, not System.out)
- No catching generic `Exception` — catch specific exception types
- No `e.printStackTrace()` — use Logger

### Testing
- New Java classes MUST have JUnit tests using `AemContext` / `AemContextExtension`
- Bug fixes must include regression tests
- Test both success and error paths
- No `Thread.sleep()` in tests — use mocks or async utilities

---

## HTL (HTML Template Language) Standards

### Data Binding
- `data-sly-use` must reference the Sling Model INTERFACE fully qualified class name, never the implementation class
- Complex logic belongs in the Sling Model, not in HTL expressions
- All user content must use proper XSS context: `@context='html'`, `@context='uri'`, etc.
- NEVER use `@context='unsafe'` — this disables all XSS protection

### Accessibility (CRITICAL — this project has active a11y remediation)
- Every form field MUST have a programmatic label (`<label for="">` or `aria-label`)
- Radio/checkbox groups MUST use `<fieldset>` + `<legend>`
- Interactive elements must be keyboard operable (Tab, Enter, Space, Arrows)
- Expandable panels must use `aria-expanded` that updates on state change
- Validation errors must link to field via `aria-describedby`
- Focus must move to first visible field on form/panel load

### HTML Structure
- Follow BEM naming: `.cmp-<componentname>__<element>`
- Include `data-cmp-is` for JS initialization hooks
- No inline JavaScript — use clientlibs
- No hardcoded strings — use `${'key' @ i18n}` for internationalization

---

## JavaScript Standards
- ES6+ syntax required (const/let, arrow functions, template literals)
- No jQuery for new code — vanilla JS only
- Null-check DOM elements before accessing properties
- Custom functions must follow `@aemforms/af-core` API patterns
- Form model changes go through Adaptive Forms rule engine, not direct DOM manipulation

---

## Security Checklist (flag as HIGH severity)
- No secrets, API keys, or tokens in code
- No SQL/JCR query string concatenation — use QueryBuilder with parameterized queries
- All user input must be validated and sanitized server-side
- Authentication checks on every protected servlet/endpoint
- No `eval()` or `Function()` constructor
- CSRF token validation on all POST endpoints
- File uploads must validate type, size, and content

---

## Maven / Build Standards
- No SNAPSHOT dependencies in release/master branch
- Dependency versions declared in parent `pom.xml`
- Use `bnd-maven-plugin` for OSGi manifests (NOT `maven-bundle-plugin`)
- AEM SDK dependencies use `provided` scope
- No skipping tests

---

## Banned Patterns (flag immediately)
- `@Inject` for JCR properties → use `@ValueMapValue`
- `getAdministrativeResourceResolver()` → use service user
- `System.out.println` → use SLF4J Logger
- `commons-lang` v2 → use `commons-lang3`
- `org.json` → use `com.google.gson` or `javax.json`
- `@context='unsafe'` in HTL → use proper XSS context
- Version numbers in content `sling:resourceType`
- `maven-bundle-plugin` → use `bnd-maven-plugin`
