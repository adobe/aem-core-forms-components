#!/usr/bin/env python3
"""
Validates a newly created AEM Core Form Component against project conventions.

Usage:
    python3 validate_component.py <component-name> [--repo-root <path>]

    component-name: lowercase component name (e.g., imagechoice, starrating)
    --repo-root:    path to aem-core-forms-components repo root (default: cwd)

Example:
    python3 validate_component.py imagechoice --repo-root /path/to/aem-core-forms-components
"""

import argparse
import os
import re
import sys
from pathlib import Path


class ValidationResult:
    def __init__(self):
        self.passed = []
        self.failed = []
        self.warnings = []

    def ok(self, msg):
        self.passed.append(msg)

    def fail(self, msg):
        self.failed.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def print_report(self):
        total = len(self.passed) + len(self.failed)
        print(f"\n{'=' * 60}")
        print(f"  Component Validation Report")
        print(f"{'=' * 60}\n")

        if self.passed:
            print(f"  PASSED ({len(self.passed)}/{total})")
            print(f"  {'-' * 40}")
            for msg in self.passed:
                print(f"  [PASS] {msg}")
            print()

        if self.warnings:
            print(f"  WARNINGS ({len(self.warnings)})")
            print(f"  {'-' * 40}")
            for msg in self.warnings:
                print(f"  [WARN] {msg}")
            print()

        if self.failed:
            print(f"  FAILED ({len(self.failed)}/{total})")
            print(f"  {'-' * 40}")
            for msg in self.failed:
                print(f"  [FAIL] {msg}")
            print()

        if not self.failed:
            print("  All checks passed!")
        else:
            print(f"  {len(self.failed)} check(s) failed. Review and fix before merging.")

        print(f"\n{'=' * 60}\n")
        return len(self.failed) == 0


def to_pascal(name):
    """imagechoice -> ImageChoice (best-effort heuristic)."""
    # Try to find the PascalCase version from actual files
    return name[0].upper() + name[1:]


def find_pascal_name(component_name, repo_root):
    """Find the actual PascalCase name from the interface file."""
    models_dir = repo_root / "bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form"
    if models_dir.exists():
        for f in models_dir.iterdir():
            if f.is_file() and f.suffix == ".java":
                if f.stem.lower() == component_name.lower():
                    return f.stem
    return to_pascal(component_name)


def check_file_exists(result, path, label):
    """Check if a file exists and report."""
    if path.exists():
        result.ok(f"{label}: {path.name}")
        return True
    else:
        result.fail(f"{label}: MISSING — {path}")
        return False


def check_file_contains(result, path, pattern, label, is_regex=False):
    """Check if a file contains a string/pattern."""
    if not path.exists():
        return False
    content = path.read_text(encoding="utf-8", errors="replace")
    if is_regex:
        if re.search(pattern, content):
            result.ok(label)
            return True
        else:
            result.fail(label)
            return False
    else:
        if pattern in content:
            result.ok(label)
            return True
        else:
            result.fail(label)
            return False


def validate_component(component_name, repo_root):
    result = ValidationResult()
    pascal = find_pascal_name(component_name, repo_root)

    print(f"\n  Validating component: {component_name} (PascalCase: {pascal})")
    print(f"  Repo root: {repo_root}\n")

    # ==========================================
    # SECTION 1: File Existence
    # ==========================================
    print("  --- File Existence Checks ---")

    # Java paths
    java_base = repo_root / "bundles/af-core/src/main/java/com/adobe/cq/forms/core/components"
    interface_path = java_base / f"models/form/{pascal}.java"
    impl_path = java_base / f"internal/models/v1/form/{pascal}Impl.java"
    constants_path = java_base / "internal/form/FormConstants.java"

    check_file_exists(result, interface_path, "Java interface")
    check_file_exists(result, impl_path, "Java implementation")

    # Test paths
    test_base = repo_root / "bundles/af-core/src/test"
    test_class = test_base / f"java/com/adobe/cq/forms/core/components/internal/models/v1/form/{pascal}ImplTest.java"
    test_content = test_base / f"resources/form/{component_name}/test-content.json"
    test_exporter = test_base / f"resources/form/{component_name}/exporter-{component_name}.json"

    check_file_exists(result, test_class, "Unit test class")
    check_file_exists(result, test_content, "Test content JSON")
    check_file_exists(result, test_exporter, "Exporter JSON")

    # UI AF Apps paths
    ui_base = repo_root / f"ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{component_name}/v1/{component_name}"
    htl_path = ui_base / f"{component_name}.html"
    renderer_js = ui_base / f"{component_name}.js"
    component_xml = ui_base / ".content.xml"
    dialog_xml = ui_base / "_cq_dialog/.content.xml"

    check_file_exists(result, component_xml, "Component definition (.content.xml)")
    check_file_exists(result, htl_path, "HTL template")
    check_file_exists(result, renderer_js, "Renderer JS")
    check_file_exists(result, dialog_xml, "Author dialog")

    # Clientlibs
    site_clientlib = ui_base / "clientlibs/site/.content.xml"
    site_js_txt = ui_base / "clientlibs/site/js.txt"
    site_css_txt = ui_base / "clientlibs/site/css.txt"
    view_js = ui_base / f"clientlibs/site/js/{component_name}view.js"
    style_file_less = ui_base / f"clientlibs/site/css/{component_name}.less"
    style_file_css = ui_base / f"clientlibs/site/css/{component_name}view.css"
    editor_clientlib = ui_base / "clientlibs/editor/.content.xml"

    check_file_exists(result, site_clientlib, "Site clientlib definition")
    check_file_exists(result, site_js_txt, "js.txt manifest")
    check_file_exists(result, site_css_txt, "css.txt manifest")
    check_file_exists(result, view_js, "Client-side view JS")
    if not style_file_less.exists() and not style_file_css.exists():
        result.fail(f"Stylesheet: MISSING — expected {component_name}.less or {component_name}view.css")
    else:
        result.ok(f"Stylesheet: {style_file_less.name if style_file_less.exists() else style_file_css.name}")
    check_file_exists(result, editor_clientlib, "Editor clientlib definition")

    # Examples
    example_proxy = repo_root / f"examples/ui.apps/src/main/content/jcr_root/apps/forms-components-examples/components/form/{component_name}/.content.xml"
    example_content = repo_root / f"examples/ui.content/src/main/content/jcr_root/content/core-components-examples/library/adaptive-form/{component_name}/.content.xml"

    check_file_exists(result, example_proxy, "Example proxy component")
    check_file_exists(result, example_content, "Example content page")

    # ==========================================
    # SECTION 2: FormConstants Registration
    # ==========================================
    print("\n  --- FormConstants Registration ---")

    if constants_path.exists():
        constants_content = constants_path.read_text()
        constant_pattern = rf'RT_FD_FORM_\w+\s*=\s*.*"{component_name}/v\d+/{component_name}"'
        if re.search(constant_pattern, constants_content):
            result.ok("FormConstants: resource type constant registered")
        else:
            result.fail(f"FormConstants: no constant found matching resource type pattern '{component_name}/vN/{component_name}'")

    # ==========================================
    # SECTION 3: Java Interface Checks
    # ==========================================
    print("\n  --- Java Interface Checks ---")

    if interface_path.exists():
        iface_content = interface_path.read_text()
        check_file_contains(result, interface_path, "@ConsumerType", "Interface: @ConsumerType annotation")
        check_file_contains(result, interface_path, "extends", "Interface: extends a base interface")
        check_file_contains(result, interface_path, "Copyright", "Interface: copyright header")

    # ==========================================
    # SECTION 4: Java Implementation Checks
    # ==========================================
    print("\n  --- Java Implementation Checks ---")

    if impl_path.exists():
        impl_content = impl_path.read_text()
        check_file_contains(result, impl_path, "@Model", "Impl: @Model annotation")
        check_file_contains(result, impl_path, "@Exporter", "Impl: @Exporter annotation")
        check_file_contains(result, impl_path, "SlingHttpServletRequest.class", "Impl: SlingHttpServletRequest adaptable")
        check_file_contains(result, impl_path, "Resource.class", "Impl: Resource adaptable")
        check_file_contains(result, impl_path, "ComponentExporter.class", "Impl: ComponentExporter adapter")
        check_file_contains(result, impl_path, "getFieldType", "Impl: getFieldType() override")
        check_file_contains(result, impl_path, "Copyright", "Impl: copyright header")

        # Check injection strategy
        if "@ValueMapValue" in impl_content:
            if "InjectionStrategy.OPTIONAL" in impl_content or "OPTIONAL" in impl_content:
                result.ok("Impl: @ValueMapValue uses OPTIONAL injection strategy")
            else:
                result.warn("Impl: @ValueMapValue found without explicit OPTIONAL injection strategy")

    # ==========================================
    # SECTION 5: HTL Template Checks
    # ==========================================
    print("\n  --- HTL Template Checks ---")

    bem_block = f"cmp-adaptiveform-{component_name}"

    if htl_path.exists():
        htl_content = htl_path.read_text()

        # data-cmp attributes
        check_file_contains(result, htl_path, 'data-cmp-is=', "HTL: data-cmp-is attribute")
        check_file_contains(result, htl_path, 'data-cmp-visible=', "HTL: data-cmp-visible attribute")
        check_file_contains(result, htl_path, 'data-cmp-enabled=', "HTL: data-cmp-enabled attribute")
        check_file_contains(result, htl_path, 'data-cmp-required=', "HTL: data-cmp-required attribute")
        check_file_contains(result, htl_path, 'data-cmp-readonly=', "HTL: data-cmp-readonly attribute")
        check_file_contains(result, htl_path, 'data-cmp-data-layer=', "HTL: data-cmp-data-layer attribute (analytics)")
        check_file_contains(result, htl_path, 'data-cmp-adaptiveformcontainer-path=', "HTL: data-cmp-adaptiveformcontainer-path attribute")

        # Shared field templates — may be referenced in the HTL or the renderer JS
        renderer_content = renderer_js.read_text() if renderer_js.exists() else ""
        combined_htl_js = htl_content + renderer_content
        for tpl_name, tpl_file in [("label", "label.html"), ("errorMessage", "errorMessage.html"),
                                    ("shortDescription", "shortDescription.html"),
                                    ("longDescription", "longDescription.html"),
                                    ("questionMark", "questionMark.html")]:
            if tpl_file in combined_htl_js:
                result.ok(f"HTL/JS: uses shared {tpl_name} template")
            else:
                result.fail(f"HTL/JS: missing shared {tpl_name} template reference")

        # BEM
        if bem_block in htl_content:
            result.ok(f"HTL: uses BEM block '{bem_block}'")
        else:
            result.fail(f"HTL: missing BEM block '{bem_block}'")

        # Widget ID convention
        if "widget" in htl_content and ("format=" in htl_content or "-widget" in htl_content):
            result.ok("HTL: widget ID convention (componentId-widget)")
        else:
            result.warn("HTL: could not verify widget ID convention '{componentId}-widget'")

        # FormStructureParser
        check_file_contains(result, htl_path, 'FormStructureParser', "HTL: uses FormStructureParser for container path")

    # ==========================================
    # SECTION 6: Accessibility Checks
    # ==========================================
    print("\n  --- Accessibility Checks ---")

    if htl_path.exists():
        htl_content = htl_path.read_text()

        # Label linkage
        has_label_for = 'for=' in htl_content or 'componentId=' in htl_content
        has_aria_label = 'aria-label' in htl_content
        if has_label_for or has_aria_label:
            result.ok("A11y: widget has label linkage (label[for] or aria-label)")
        else:
            result.fail("A11y: no label linkage found — need <label for=...> or aria-label on widget")

        # Error message container
        if f'{bem_block}__errormessage' in htl_content or 'errorMessage' in htl_content:
            result.ok("A11y: error message container present")
        else:
            result.fail("A11y: missing error message container")

    # JS view accessibility methods
    if view_js.exists():
        js_content = view_js.read_text()

        # Required getter methods (universal across all views)
        for method in ['getWidget', 'getLabel', 'getErrorDiv', 'getDescription', 'getTooltipDiv', 'getQuestionMarkDiv']:
            if method in js_content:
                result.ok(f"A11y JS: {method}() implemented")
            else:
                result.fail(f"A11y JS: {method}() MISSING — required by all view classes")

        # Focus management
        if 'setActive' in js_content and 'setInactive' in js_content:
            result.ok("A11y JS: setActive()/setInactive() focus management")
        else:
            result.warn("A11y JS: setActive()/setInactive() not found — verify focus management in setModel()")

        # Value sync
        if 'setModelValue' in js_content or 'updateValue' in js_content:
            result.ok("A11y JS: value synchronization (setModelValue/updateValue)")
        else:
            result.warn("A11y JS: no value sync found (setModelValue or updateValue)")

    # Stylesheet focus styles
    style_path = style_file_less if style_file_less.exists() else style_file_css if style_file_css.exists() else None
    if style_path and style_path.exists():
        css_content = style_path.read_text()
        if ':focus' in css_content or '&:focus' in css_content:
            result.ok("A11y CSS: :focus styles defined")
        else:
            result.warn("A11y CSS: no :focus styles — ensure visible focus indicator (WCAG 2.4.7)")

        if 'aria-invalid' in css_content:
            result.ok("A11y CSS: aria-invalid error styling")
        else:
            result.warn("A11y CSS: no [aria-invalid] styling — consider adding error state styles")

    # ==========================================
    # SECTION 7: Component Definition Checks
    # ==========================================
    print("\n  --- Component Definition Checks ---")

    if component_xml.exists():
        xml_content = component_xml.read_text()
        check_file_contains(result, component_xml, 'jcr:primaryType="cq:Component"', "Component XML: jcr:primaryType=cq:Component")
        check_file_contains(result, component_xml, 'sling:resourceSuperType=', "Component XML: sling:resourceSuperType defined")

        if 'sling:resourceSuperType="core/fd/components/form/base/' in xml_content:
            result.ok("Component XML: extends base component")
        else:
            result.warn("Component XML: does not directly extend base — verify inheritance chain")

        check_file_contains(result, component_xml, 'componentGroup=', "Component XML: componentGroup defined")

    # ==========================================
    # SECTION 8: Dialog Checks
    # ==========================================
    print("\n  --- Dialog Checks ---")

    if dialog_xml.exists():
        dialog_content = dialog_xml.read_text()
        check_file_contains(result, dialog_xml, 'sling:resourceType="cq/gui/components/authoring/dialog"', "Dialog: correct resourceType")
        check_file_contains(result, dialog_xml, 'trackingFeature=', "Dialog: trackingFeature defined")

        if 'extraClientlibs=' in dialog_content:
            result.ok("Dialog: extraClientlibs defined for editor JS")
        else:
            result.warn("Dialog: no extraClientlibs — editor-specific JS won't load")

        # Check for base dialog includes (help/accessibility tabs)
        if 'core/fd/components/form/base/' in dialog_content:
            result.ok("Dialog: includes base dialog fields")
        else:
            result.warn("Dialog: no base dialog includes found — verify help/accessibility tabs")

    # ==========================================
    # SECTION 9: Clientlib Checks
    # ==========================================
    print("\n  --- Clientlib Checks ---")

    if site_clientlib.exists():
        cl_content = site_clientlib.read_text()
        expected_category = f"core.forms.components.{component_name}"
        if expected_category in cl_content:
            result.ok(f"Site clientlib: category follows naming convention")
        else:
            result.fail(f"Site clientlib: expected category containing '{expected_category}'")

        if 'core.forms.components.runtime.base' in cl_content:
            result.ok("Site clientlib: depends on runtime.base")
        else:
            result.warn("Site clientlib: missing dependency on core.forms.components.runtime.base")

        check_file_contains(result, site_clientlib, 'allowProxy="{Boolean}true"', "Site clientlib: allowProxy enabled")

    if site_js_txt.exists():
        check_file_contains(result, site_js_txt, '#base=js', "js.txt: has #base=js directive")

    if site_css_txt.exists():
        check_file_contains(result, site_css_txt, '#base=css', "css.txt: has #base=css directive")

    if view_js.exists():
        js_content = view_js.read_text()
        check_file_contains(result, view_js, 'FormView.Utils.setupField', "View JS: registers via FormView.Utils.setupField")
        check_file_contains(result, view_js, r'static\s+IS\s+=', "View JS: static IS property defined", is_regex=True)
        check_file_contains(result, view_js, r'static\s+bemBlock\s+=', "View JS: static bemBlock property defined", is_regex=True)
        check_file_contains(result, view_js, r'static\s+selectors\s+=', "View JS: static selectors defined", is_regex=True)

        if f"'{bem_block}'" in js_content or f'"{bem_block}"' in js_content:
            result.ok(f"View JS: BEM block matches '{bem_block}'")
        else:
            result.fail(f"View JS: BEM block mismatch — expected '{bem_block}'")

    # ==========================================
    # SECTION 10: BEM Consistency
    # ==========================================
    print("\n  --- BEM Consistency ---")

    expected_bem_elements = ['__widget', '__label', '__errormessage', '__shortdescription', '__longdescription', '__questionmark', '__label-container']

    # Check BEM classes in component files. JS view files often construct BEM classes
    # dynamically (e.g., `${ClassName.bemBlock}__errormessage`), so also search for the
    # BEM element suffix pattern.
    style_config = ui_base / "_cq_styleConfig/.content.xml"
    files_to_check_bem = [htl_path, view_js, style_path, style_config, renderer_js]
    for bem_el in expected_bem_elements:
        full_class = f"{bem_block}{bem_el}"
        found_in = []
        for fp in files_to_check_bem:
            if fp and fp.exists():
                content = fp.read_text()
                # Check for literal BEM class OR dynamic construction (e.g., `.${...bemBlock}__widget`)
                if full_class in content or f'{bem_el}' in content:
                    if full_class in content or (bem_el in content and bem_block in content):
                        found_in.append(fp.name)
        if found_in:
            result.ok(f"BEM: '{full_class}' found in {', '.join(found_in)}")
        elif bem_el in ('__widget', '__label', '__errormessage'):
            result.fail(f"BEM: '{full_class}' not found in any file — required element")
        else:
            result.warn(f"BEM: '{full_class}' not found — may be handled by shared templates")

    # ==========================================
    # SECTION 11: Example Content Checks
    # ==========================================
    print("\n  --- Example Content Checks ---")

    if example_proxy.exists():
        proxy_content = example_proxy.read_text()
        if f"core/fd/components/form/{component_name}/" in proxy_content:
            result.ok("Example proxy: sling:resourceSuperType points to correct component")
        else:
            result.fail(f"Example proxy: sling:resourceSuperType doesn't reference '{component_name}'")

        check_file_contains(result, example_proxy, 'componentGroup="Core Components Examples', "Example proxy: correct componentGroup")

    if example_content.exists():
        ex_content = example_content.read_text()
        if 'fd:version' in ex_content:
            if 'xmlns:fd' in ex_content:
                result.ok("Example content: fd namespace declared and fd:version used")
            else:
                result.fail("Example content: fd:version used WITHOUT xmlns:fd namespace — invalid XML")
        else:
            result.warn("Example content: no fd:version attribute — may be needed for form container")

        check_file_contains(result, example_content, 'guideContainer', "Example content: guideContainer present")

    # ==========================================
    # SECTION 12: Test Checks
    # ==========================================
    print("\n  --- Test Checks ---")

    if test_class.exists():
        test_content_str = test_class.read_text()
        check_file_contains(result, test_class, '@ExtendWith(AemContextExtension.class)', "Test: @ExtendWith(AemContextExtension)")
        check_file_contains(result, test_class, 'FormsCoreComponentTestContext.newAemContext()', "Test: uses FormsCoreComponentTestContext")
        check_file_contains(result, test_class, 'testFieldType', "Test: tests getFieldType()")
        check_file_contains(result, test_class, 'testJSONExport', "Test: tests JSON export")

    if test_content.exists():
        tc_content = test_content.read_text()
        if f"core/fd/components/form/{component_name}/" in tc_content:
            result.ok("Test content JSON: sling:resourceType matches component")
        else:
            result.fail(f"Test content JSON: sling:resourceType doesn't reference '{component_name}'")

        check_file_contains(result, test_content, '"fieldType"', "Test content JSON: fieldType property present")

    # ==========================================
    # SECTION 13: Runtime View JS — override contract
    # ==========================================
    print("\n  --- Runtime View JS Contract ---")

    if view_js.exists():
        js = view_js.read_text()
        # An overridden update* handler must call super, or it silently drops the base
        # behaviour (root data-cmp-* attributes, error-message rendering, etc.).
        for handler in ("updateEnabled", "updateReadOnly", "updateValidity", "updateRequired"):
            if re.search(rf'\b{handler}\s*\(', js):
                if re.search(rf'super\.{handler}\s*\(', js):
                    result.ok(f"View JS: {handler}() override calls super")
                else:
                    result.fail(f"View JS: {handler}() overridden but never calls super.{handler}() "
                                f"— root data-cmp-*/error message will go stale")
        # An overridden updateValue must end by calling updateEmptyStatus().
        if re.search(r'\bupdateValue\s*\(', js):
            if 'updateEmptyStatus' in js:
                result.ok("View JS: updateValue() override calls updateEmptyStatus()")
            else:
                result.fail("View JS: updateValue() overridden without updateEmptyStatus() "
                            "— --filled/--empty modifier will not update")

    # ==========================================
    # SECTION 14: Editor clientlib JS safety
    # ==========================================
    print("\n  --- Editor Clientlib JS ---")

    editor_js_dir = ui_base / "clientlibs/editor/js"
    if editor_js_dir.exists():
        for jsf in sorted(editor_js_dir.glob("*.js")):
            content = jsf.read_text()
            if re.search(r'\.innerHTML\s*=', content):
                result.fail(f"Editor JS ({jsf.name}): assigns innerHTML — use textContent")
            else:
                result.ok(f"Editor JS ({jsf.name}): no innerHTML assignment")

    # ==========================================
    # SECTION 15: BEM modifier classes must have CSS
    # ==========================================
    print("\n  --- BEM Modifier Styling ---")

    if htl_path.exists() and style_path is not None and style_path.exists():
        htl = htl_path.read_text()
        css = style_path.read_text()
        modifiers = sorted(set(re.findall(rf'{re.escape(bem_block)}__[a-z0-9-]+--[a-z0-9-]+', htl)))
        if not modifiers:
            result.ok("BEM modifiers: none emitted literally in HTL")
        for mod in modifiers:
            if mod in css:
                result.ok(f"BEM modifier: '{mod}' has a CSS rule")
            else:
                result.warn(f"BEM modifier: '{mod}' emitted in HTL but has no CSS rule — likely a no-op feature")

    # Empty design dialog (a tab/container with only a comment) is noise — omit it.
    design_dialog = ui_base / "_cq_design_dialog/.content.xml"
    if design_dialog.exists():
        dd = design_dialog.read_text()
        if re.search(r'<items[^>]*>\s*(<!--.*?-->)?\s*</items>', dd, re.DOTALL):
            result.warn("Design dialog: contains an empty tab/container — remove it or add real fields")

    # ==========================================
    # SECTION 16: Cypress specs & test wiring
    # ==========================================
    print("\n  --- Cypress Tests & Wiring ---")

    runtime_spec = repo_root / f"ui.tests/test-module/specs/{component_name}/{component_name}.runtime.cy.js"
    authoring_spec = repo_root / f"ui.tests/test-module/specs/{component_name}/{component_name}.authoring.cy.js"
    check_file_exists(result, runtime_spec, "Cypress runtime spec")
    check_file_exists(result, authoring_spec, "Cypress authoring spec")

    forms_constants = repo_root / "ui.tests/test-module/libs/commons/formsConstants.js"
    if forms_constants.exists() and component_name in forms_constants.read_text():
        result.ok("formsConstants.js: component entry present")
    else:
        result.warn(f"formsConstants.js: no entry referencing '{component_name}'")

    runtime_all = repo_root / "ui.af.apps/src/main/content/jcr_root/apps/core/fd/af-clientlibs/core-forms-components-runtime-all/.content.xml"
    if runtime_all.exists() and f"core.forms.components.{component_name}.v1.runtime" in runtime_all.read_text():
        result.ok("runtime-all: component runtime clientlib embedded")
    else:
        result.fail(f"runtime-all: 'core.forms.components.{component_name}.v1.runtime' not embedded "
                    f"— the runtime Cypress suite will silently break")

    if runtime_spec.exists():
        spec = runtime_spec.read_text()
        if re.search(r"cy\.get\(\s*['\"]\*['\"]\s*\)", spec):
            result.warn("Cypress runtime spec: cy.get('*') fails be.visible on hidden inputs "
                        "— use \"*:not([type=hidden])\"")
        if re.search(r"have\.attr['\"][^)]*\)\s*\.should\([^)]*have\.attr", spec):
            result.warn("Cypress runtime spec: chained should('(not.)have.attr') detected "
                        "— re-query for each assertion (the first yields the attr value)")

    # Print final report
    return result.print_report()


def main():
    parser = argparse.ArgumentParser(
        description="Validate an AEM Core Form Component against project conventions.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("component_name", help="Lowercase component name (e.g., imagechoice)")
    parser.add_argument("--repo-root", default=".", help="Path to aem-core-forms-components repo root (default: cwd)")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()

    # Sanity check
    if not (repo_root / "bundles/af-core").exists():
        print(f"Error: '{repo_root}' doesn't look like an aem-core-forms-components repo.")
        print("       Expected to find bundles/af-core/. Use --repo-root to specify the correct path.")
        sys.exit(2)

    component_name = args.component_name.lower().strip()
    success = validate_component(component_name, repo_root)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
