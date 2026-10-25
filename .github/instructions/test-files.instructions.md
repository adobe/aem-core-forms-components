---
applyTo: "**/test/**,**/*Test.java,**/*Spec.js,**/*.spec.*"
---

# Test File Review Rules

## Java Tests
- Must use `@ExtendWith(AemContextExtension.class)` — not JUnit 4 `@RunWith`
- Use `AemContext` for mock AEM environment setup
- Mock external services with `context.registerService()` — never call real services
- Test method names must be descriptive: `testGetValue_whenPropertyMissing_returnsNull()`
- Each test verifies ONE behavior
- No test-to-test dependencies — each test must run independently
- Test both success AND error paths

## Banned in Tests
- No `it.only` or `describe.only` — our CI catches this but flag it anyway
- No `Thread.sleep()` — use mocks or async utilities
- No hardcoded AEM instance URLs (like `http://localhost:4502`)
- No tests requiring external network connectivity

## Coverage
- New Sling Models must have tests covering: property injection, @PostConstruct logic, edge cases (null values)
- New servlets must have tests covering: valid request, invalid input, missing auth
- Accessibility-related changes must have tests verifying ARIA attribute rendering
