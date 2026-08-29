---
applyTo: "**/*.java"
---

# Java & Sling Model Review Rules

## Sling Model Checklist
When reviewing Java files that contain `@Model` annotation:

1. Verify `@Model` has explicit `adaptables`, `adapters`, and `resourceType` parameters
2. Flag ANY use of `@Inject` for JCR properties — must use `@ValueMapValue` instead
3. Verify the model implements an interface from `*.models.*` package
4. Verify the implementation is in `*.internal.models.*` package
5. Check that `resourceType` in `@Model` matches the component's `sling:resourceType`
6. If extending a core component, verify delegation pattern with `@Self @Via(type = ResourceSuperType.class)`

## Servlet Checklist
When reviewing files extending `SlingSafeMethodsServlet` or `SlingAllMethodsServlet`:

1. Must use `@SlingServletResourceTypes` (not path-based registration)
2. Must explicitly declare supported HTTP methods
3. POST servlets must validate CSRF tokens
4. Response content type must be explicitly set
5. All input parameters must be validated and sanitized

## Security — Flag as Error
- `getAdministrativeResourceResolver()` — banned, use service user
- `System.out.println` or `e.printStackTrace()` — use SLF4J Logger
- Empty catch blocks `catch(Exception e) {}` — must log the error
- Catching generic `Exception` — catch specific types
- String concatenation in JCR queries — use QueryBuilder API

## Testing
- New or modified classes should have corresponding `*Test.java` files
- Tests must use `@ExtendWith(AemContextExtension.class)`
- No `Thread.sleep()` in tests
