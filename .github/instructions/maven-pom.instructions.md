---
applyTo: "**/pom.xml"
---

# Maven POM Review Rules

## Dependencies
- No SNAPSHOT dependencies in master/release branches
- All dependency versions must be declared in the parent `pom.xml`, not in individual modules
- AEM SDK dependencies must use `provided` scope
- Flag addition of `commons-lang` (v2) — must use `commons-lang3`
- Flag addition of `org.json` — must use `com.google.gson` or `javax.json`
- Flag addition of `com.google.guava` — use Java standard library equivalents

## Build Plugins
- OSGi bundle manifests must use `bnd-maven-plugin` — flag if `maven-bundle-plugin` is used
- Do not skip tests (`-DskipTests` should not be in any profile used for CI)

## Content Packages
- Content packages must follow FileVault packaging conventions
- Verify `content-package-maven-plugin` configuration is correct
