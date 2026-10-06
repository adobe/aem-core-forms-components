#!/usr/bin/env python3
"""
Parse CSS and generate theme.structure content.xml per css-to-theme-content-xml skill.
"""
import re
import sys
from collections import defaultdict

# Selector pattern -> (af2_id, state)
# State: default, hover, focus, error, success, disabled, active, checked
SELECTOR_MAP = [
    # Container / Form
    (r"^\.cmp-container\.cmp-adaptiveform-container$", ("af2_form", "default")),
    (r"^\.cmp-adaptiveform-container$", ("af2_form", "default")),
    # Button
    (r"^\.cmp-adaptiveform-button$", ("af2_button", "default")),
    (r"^\.cmp-adaptiveform-button__widget$", ("af2_button", "default")),
    (r"^\.cmp-adaptiveform-button__widget:hover$", ("af2_button", "hover")),
    (r"^\.cmp-adaptiveform-button__widget:focus(-visible)?$", ("af2_button", "focus")),
    (r"^\.cmp-adaptiveform-button__widget:active$", ("af2_button", "active")),
    (r"^\.cmp-adaptiveform-button__widget:disabled$", ("af2_button", "disabled")),
    (r"^\[data-cmp-enabled\]:not\(\[data-cmp-enabled=true\]\) \.cmp-adaptiveform-button__widget$", ("af2_button", "disabled")),
    (r"^\.cmp-adaptiveform-button__text$", ("af2_buttontext", "default")),
    (r"^\.cmp-adaptiveform-button__longdescription$", ("af2_buttondescriptionlong", "default")),
    (r"^\.cmp-adaptiveform-button__shortdescription$", ("af2_buttondescriptionshort", "default")),
    (r"^\.cmp-adaptiveform-button__questionmark$", ("af2_buttonhelpicon", "default")),
    (r"^\.cmp-adaptiveform-button__help-container$", ("af2_buttonhelpcontainer", "default")),
    # Input fields - widget
    (r"^\.cmp-adaptiveform-textinput__widget$", ("af2_textinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-textinput__widget:focus(-visible)?$", ("af2_textinputwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-textinput__widget:hover$", ("af2_textinputwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-textinput__widget:disabled$", ("af2_textinputwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-numberinput__widget$", ("af2_numberinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-numberinput__widget:focus(-visible)?$", ("af2_numberinputwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-numberinput__widget:hover$", ("af2_numberinputwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-numberinput__widget:disabled$", ("af2_numberinputwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-emailinput__widget$", ("af2_emailinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-emailinput__widget:focus(-visible)?$", ("af2_emailinputwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-emailinput__widget:hover$", ("af2_emailinputwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-emailinput__widget:disabled$", ("af2_emailinputwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-telephoneinput__widget$", ("af2_telephoneinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-telephoneinput__widget:focus(-visible)?$", ("af2_telephoneinputwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-telephoneinput__widget:hover$", ("af2_telephoneinputwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-telephoneinput__widget:disabled$", ("af2_telephoneinputwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-datepicker__widget$", ("af2_datepickerwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datepicker__widget:focus(-visible)?$", ("af2_datepickerwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-datepicker__widget:hover$", ("af2_datepickerwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-datepicker__widget:disabled$", ("af2_datepickerwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-dropdown__widget$", ("af2_dropdownwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-dropdown__widget:focus(-visible)?$", ("af2_dropdownwidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-dropdown__widget:hover$", ("af2_dropdownwidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-dropdown__widget:disabled$", ("af2_dropdownwidgetandtext", "disabled")),
    (r"^\.cmp-adaptiveform-datetime__widget$", ("af2_datetimewidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datetime__widget:focus(-visible)?$", ("af2_datetimewidgetandtext", "focus")),
    (r"^\.cmp-adaptiveform-datetime__widget:hover$", ("af2_datetimewidgetandtext", "hover")),
    (r"^\.cmp-adaptiveform-datetime__widget:disabled$", ("af2_datetimewidgetandtext", "disabled")),
    (r"^textarea\.cmp-adaptiveform-textinput__widget$", ("af2_textareawidgetandtext", "default")),
    # Input fields - root (widgetAndText)
    (r"^\.cmp-adaptiveform-textinput$", ("af2_textinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-numberinput$", ("af2_numberinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-emailinput$", ("af2_emailinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-telephoneinput$", ("af2_telephoneinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datepicker$", ("af2_datepickerwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-dropdown$", ("af2_dropdownwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datetime$", ("af2_datetimewidgetandtext", "default")),
    # Input fields - data-cmp-valid states (quotes normalized before matching)
    (r"^\.cmp-adaptiveform-textinput\[data-cmp-valid=false\]$", ("af2_textinputwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-textinput\[data-cmp-valid=true\]$", ("af2_textinputwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-numberinput\[data-cmp-valid=false\]$", ("af2_numberinputwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-numberinput\[data-cmp-valid=true\]$", ("af2_numberinputwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-emailinput\[data-cmp-valid=false\]$", ("af2_emailinputwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-emailinput\[data-cmp-valid=true\]$", ("af2_emailinputwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-telephoneinput\[data-cmp-valid=false\]$", ("af2_telephoneinputwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-telephoneinput\[data-cmp-valid=true\]$", ("af2_telephoneinputwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-datepicker\[data-cmp-valid=false\]$", ("af2_datepickerwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-datepicker\[data-cmp-valid=true\]$", ("af2_datepickerwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-dropdown\[data-cmp-valid=false\]$", ("af2_dropdownwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-dropdown\[data-cmp-valid=true\]$", ("af2_dropdownwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-datetime\[data-cmp-valid=false\]$", ("af2_datetimewidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-datetime\[data-cmp-valid=true\]$", ("af2_datetimewidgetandtext", "success")),
    # Checkbox / Radio / CheckboxGroup
    (r"^\.cmp-adaptiveform-checkboxgroup$", ("af2_checkboxgroupwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-checkboxgroup\[data-cmp-valid=false\]$", ("af2_checkboxgroupwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-checkboxgroup\[data-cmp-valid=true\]$", ("af2_checkboxgroupwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-checkbox$", ("af2_checkboxwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-checkbox\[data-cmp-valid=false\]$", ("af2_checkboxwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-checkbox\[data-cmp-valid=true\]$", ("af2_checkboxwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-checkbox__widget$", ("af2_checkboxwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-radiobutton$", ("af2_radiobuttonwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-radiobutton\[data-cmp-valid=false\]$", ("af2_radiobuttonwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-radiobutton\[data-cmp-valid=true\]$", ("af2_radiobuttonwidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-radiobutton\[data-cmp-required=true\]$", ("af2_radiobuttonwidgetandtext", "mandatory")),
    (r"^\.cmp-adaptiveform-radiobutton__widget$", ("af2_radiobuttonwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-radiobutton__option__widget$", ("af2_radiobuttonwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-radiobutton__option__widget:focus(-visible)?$", ("af2_radiobuttonwidgetandtext", "focus")),
    # Switch
    (r"^\.cmp-adaptiveform-switch$", ("af2_switchwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-switch__widget-slider$", ("af2_switchonlabel", "default")),
    (r"^\.cmp-adaptiveform-switch__circle-indicator$", ("af2_switchhandle", "default")),
    (r"^\.cmp-adaptiveform-switch\[data-cmp-valid=false\]$", ("af2_switchwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-switch\[data-cmp-valid=true\]$", ("af2_switchwidgetandtext", "success")),
    # File input
    (r"^\.cmp-adaptiveform-fileinput$", ("af2_fileinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-fileinput__widget$", ("af2_fileinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-fileinput\[data-cmp-valid=false\]$", ("af2_fileinputwidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-fileinput\[data-cmp-valid=true\]$", ("af2_fileinputwidgetandtext", "success")),
    # Panel / Accordion / Tabs / Wizard
    (r"^\.cmp-container$", ("af2_panel", "default")),
    (r"^\.cmp-container__label$", ("af2_panellabel", "default")),
    (r"^\.cmp-container__label-container$", ("af2_panellabelcontainer", "default")),
    (r"^\.cmp-accordion$", ("af2_accordionpanel", "default")),
    (r"^\.cmp-accordion__panel$", ("af2_accordionpanelwidget", "default")),
    (r"^\.cmp-tabs$", ("af2_tabsontoppanel", "default")),
    (r"^\.cmp-verticaltabs$", ("af2_tabsonleftpanel", "default")),
    (r"^\.cmp-adaptiveform-wizard$", ("af2_wizardpanel", "default")),
    # Image / Text / Title
    (r"^\.cmp-image$", ("af2_image", "default")),
    (r"^\.cmp-image__image$", ("af2_image", "default")),
    (r"^\.cmp-adaptiveform-text$", ("af2_text", "default")),
    (r"^\.cmp-title__text$", ("af2_title", "default")),
    # reCAPTCHA / hCaptcha
    (r"^\.cmp-adaptiveform-recaptcha$", ("af2_recaptchawidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-recaptcha\[data-cmp-valid=false\]$", ("af2_recaptchawidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-recaptcha\[data-cmp-valid=true\]$", ("af2_recaptchawidgetandtext", "success")),
    (r"^\.cmp-adaptiveform-hcaptcha$", ("af2_hcaptchawidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-hcaptcha\[data-cmp-valid=false\]$", ("af2_hcaptchawidgetandtext", "error")),
    (r"^\.cmp-adaptiveform-hcaptcha\[data-cmp-valid=true\]$", ("af2_hcaptchawidgetandtext", "success")),
    # Footer
    (r"^\.cmp-adaptiveform-footer$", ("af2_footer", "default")),
    (r"^\.cmp-adaptiveform-footer__text$", ("af2_footertext", "default")),
    # RadioButton label / error message (Pattern C, per component-selectors.md)
    (r"^\.cmp-adaptiveform-radiobutton__label$", ("af2_radiobuttonlabel", "default")),
    (r"^\.cmp-adaptiveform-radiobutton__errormessage$", ("af2_radiobuttonerrormessage", "default")),
    (r"^\.cmp-adaptiveform-radiobutton\[data-cmp-required=true\] \.cmp-adaptiveform-radiobutton__label::after$", ("af2_radiobuttonlabel", "mandatory")),
]

# Pattern A input fields (component-selectors.md) share the same sub-element
# set: label, label-container, help icon, short/long description, error
# message, plus compound data-attribute states on the __widget/__label.
# Generated here instead of hand-duplicated per component.
_PATTERN_A_COMPONENTS = [
    "textinput", "numberinput", "emailinput", "telephoneinput",
    "datepicker", "datetime", "dropdown",
]
for _c in _PATTERN_A_COMPONENTS:
    _wid = f"af2_{_c}widgetandtext"
    SELECTOR_MAP.extend([
        (rf"^\.cmp-adaptiveform-{_c}__label$", (f"af2_{_c}label", "default")),
        (rf"^\.cmp-adaptiveform-{_c}__label-container$", (f"af2_{_c}labelcontainer", "default")),
        (rf"^\.cmp-adaptiveform-{_c}__questionmark$", (f"af2_{_c}helpicon", "default")),
        (rf"^\.cmp-adaptiveform-{_c}__shortdescription$", (f"af2_{_c}descriptionshort", "default")),
        (rf"^\.cmp-adaptiveform-{_c}__longdescription$", (f"af2_{_c}descriptionlong", "default")),
        (rf"^\.cmp-adaptiveform-{_c}__errormessage$", (f"af2_{_c}errormessage", "default")),
        (rf"^\.cmp-adaptiveform-{_c}\[data-cmp-required=true\]$", (_wid, "mandatory")),
        (rf"^\.cmp-adaptiveform-{_c}\[data-cmp-valid=false\] \.cmp-adaptiveform-{_c}__widget$", (_wid, "error")),
        (rf"^\.cmp-adaptiveform-{_c}\[data-cmp-valid=true\] \.cmp-adaptiveform-{_c}__widget$", (_wid, "success")),
        (rf"^\.cmp-adaptiveform-{_c}\[data-cmp-required=true\] \.cmp-adaptiveform-{_c}__label::after$", (f"af2_{_c}label", "mandatory")),
    ])
del _c, _wid

# @media queries that describe a real viewport breakpoint (map onto the
# phone_x0023_*/tablet_x0023_* attribute buckets that _cq_styleConfig already
# supports per-component). Anything else (prefers-reduced-motion,
# forced-colors, prefers-color-scheme, print, ...) has no bucket in the
# schema at all and must stay in the clientlib CSS instead of content.xml.
def classify_breakpoint(query):
    q = query.lower()
    if "max-width" in q:
        return "phone"
    if "min-width" in q:
        return "tablet"
    return None


def strip_comments(content):
    return re.sub(r"/\*.*?\*/", "", content, flags=re.DOTALL)


def extract_custom_properties(content):
    """Collect --name: value; declarations from :root blocks."""
    props = {}
    for m in re.finditer(r":root\s*\{([^}]*)\}", content, re.DOTALL):
        for part in m.group(1).split(";"):
            part = part.strip()
            if part.startswith("--") and ":" in part:
                name, val = part.split(":", 1)
                props[name.strip()] = val.strip()
    return props


def resolve_var(val, custom_props, _depth=0):
    """Substitute var(--x) / var(--x, fallback) with resolved literal values."""
    if _depth > 5 or "var(" not in val:
        return val

    def repl(m):
        name = m.group(1).strip()
        fallback = m.group(2)
        if name in custom_props:
            return resolve_var(custom_props[name], custom_props, _depth + 1)
        if fallback is not None:
            return fallback.strip()
        return m.group(0)

    return re.sub(r"var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^()]*))?\)", repl, val)


def split_top_level_commas(s):
    """Split on commas that are not nested inside parentheses."""
    parts = []
    depth = 0
    current = []
    for ch in s:
        if ch == "(":
            depth += 1
            current.append(ch)
        elif ch == ")":
            depth -= 1
            current.append(ch)
        elif ch == "," and depth == 0:
            parts.append("".join(current))
            current = []
        else:
            current.append(ch)
    parts.append("".join(current))
    return parts


def expand_functional_pseudo(selector):
    """Expand :is(a, b, c) / :where(a, b, c) into one selector per alternative,
    preserving whatever precedes/follows the functional pseudo-class and the
    state (:hover, :focus-visible, ...) that trails it."""
    m = re.search(r":(?:is|where)\(([^()]*)\)", selector, re.DOTALL)
    if not m:
        return [selector]
    alts = [a.strip() for a in split_top_level_commas(m.group(1)) if a.strip()]
    results = []
    for alt in alts:
        expanded = selector[:m.start()] + alt + selector[m.end():]
        results.extend(expand_functional_pseudo(expanded))
    return results


def normalize_attr_quotes(sel):
    """[attr='val'] / [attr="val"] -> [attr=val] so SELECTOR_MAP patterns match
    regardless of how the attribute selector was quoted."""
    return re.sub(r"\[([a-zA-Z0-9_-]+)=(['\"])([^'\"]*)\2\]", r"[\1=\3]", sel)


def extract_media_blocks(content):
    """Brace-depth-aware extraction of @media {...} blocks.
    Returns (content_with_media_removed, [(query, inner_css), ...])."""
    blocks = []
    out = []
    i, n = 0, len(content)
    opener = re.compile(r"@media\s*([^{]+)\{")
    while i < n:
        m = opener.search(content, i)
        if not m:
            out.append(content[i:])
            break
        out.append(content[i:m.start()])
        depth = 1
        j = m.end()
        while j < n and depth > 0:
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
            j += 1
        blocks.append((m.group(1).strip(), content[m.end():j - 1]))
        i = j
    return "".join(out), blocks


def find_selectors(content):
    """Parse selector { declarations } pairs, expanding comma lists and
    :is()/:where() groups into individual (selector, block) rules."""
    rules = []
    pattern = re.compile(r"([^{}]+)\{([^{}]*)\}", re.DOTALL)
    for m in pattern.finditer(content):
        selector_text = m.group(1).strip()
        block = m.group(2)
        if not selector_text or selector_text.startswith("@") or selector_text.startswith(":root"):
            continue
        for compound in split_top_level_commas(selector_text):
            compound = compound.strip()
            if not compound:
                continue
            for expanded in expand_functional_pseudo(compound):
                sel = re.sub(r"\s+", " ", expanded).strip()
                if sel.startswith(".cmp-") or "cmp-adaptiveform" in sel or "cmp-container" in sel or "cmp-title" in sel:
                    rules.append((sel, block))
    return rules


def parse_css(content):
    """Parse CSS into (selector, block, breakpoint) list.
    Comments are stripped first. Viewport @media blocks (max-width/min-width)
    are re-parsed and tagged phone/tablet. Feature/preference @media blocks
    (prefers-reduced-motion, forced-colors, prefers-color-scheme, print, ...)
    have no representation in _cq_styleConfig and are skipped with a note."""
    content = strip_comments(content)
    content_no_media, media_blocks = extract_media_blocks(content)

    rules = [(sel, block, "default") for sel, block in find_selectors(content_no_media)]

    for query, inner in media_blocks:
        breakpoint_name = classify_breakpoint(query)
        if breakpoint_name:
            rules.extend((sel, block, breakpoint_name) for sel, block in find_selectors(inner))
        else:
            print(
                f"NOTE: skipped '@media {query}' — not representable in _cq_styleConfig "
                f"(only default/phone/tablet breakpoints exist); keep it in the clientlib CSS.",
                file=sys.stderr,
            )
    return rules


def resolve_selector(sel):
    """Resolve selector to (af2_id, state)."""
    sel = normalize_attr_quotes(sel.strip())
    for pattern, (af2_id, state) in SELECTOR_MAP:
        if re.match(pattern, sel):
            return (af2_id, state)
    return None


def parse_declarations(block, custom_props):
    """Parse CSS declarations into list of (prop, val), resolving var()."""
    props = []
    for part in block.split(";"):
        part = part.strip()
        if ":" in part:
            idx = part.index(":")
            prop, val = part[:idx], part[idx + 1:].strip()
            if prop and val:
                props.append((prop, resolve_var(val, custom_props)))
    return props


def build_bracket(props):
    """Build bracket value string from props."""
    parts = []
    for prop, val in props:
        n = normalize_prop(prop, val)
        if n:
            parts.append(n)
    if not parts:
        return None
    return "[" + ",".join(parts) + "]"


def hex_to_rgb(hex_val):
    """Convert #RRGGBB or #RGB to rgb(r,g,b). Commas escaped in normalize_prop."""
    h = hex_val.lstrip("#")
    if len(h) == 6:
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    elif len(h) == 3:
        r, g, b = int(h[0] * 2, 16), int(h[1] * 2, 16), int(h[2] * 2, 16)
    else:
        return hex_val
    return f"rgb({r},{g},{b})"


def normalize_prop(prop, val):
    """Normalize CSS property for bracket format. Convert hex to rgb, escape commas."""
    prop = prop.strip().lower()
    val = val.strip()
    # Skip url(), gradients, and other functions with no bracket-format equivalent
    if "url(" in val or "gradient" in val or "color-mix(" in val:
        print(
            f"NOTE: dropped '{prop}: {val}' — value uses a CSS function with no bracket-format "
            f"equivalent; use cssOverride or keep it in the clientlib CSS.",
            file=sys.stderr,
        )
        return None
    # Convert hex to rgb (returns rgb(r,g,b) with raw commas)
    hex_match = re.search(r"#([0-9a-fA-F]{3,8})\b", val)
    if hex_match:
        val = re.sub(r"#([0-9a-fA-F]{3,8})\b", lambda m: hex_to_rgb(m.group(0)), val)
    # Escape commas in values for JCR bracket format
    val = val.replace(",", "\\,")
    return f"{prop}:{val}"


def escape_commas(val):
    """Escape commas for bracket format: , -> \\,"""
    return val.replace(",", "\\,")


def xml_escape_attr(val):
    """Escape a bracket-format string for safe embedding in a double-quoted XML attribute."""
    return val.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def extract_ui_metadata(props):
    """Extract UI metadata (popover, backgroundColor) from props."""
    ui = []
    has_border = any("border" in p for p, _ in props)
    has_border_radius = any("radius" in p for p, _ in props)
    has_padding = any("padding" in p for p, _ in props)
    has_margin = any("margin" in p for p, _ in props)
    bg = None
    for p, v in props:
        if "background" in p and "color" in p.lower() and "url" not in v and "color-mix(" not in v:
            bg = v.strip()
            hex_m = re.search(r"#([0-9a-fA-F]{3,8})\b", bg)
            if hex_m:
                bg = escape_commas(hex_to_rgb(hex_m.group(0)))
    if bg:
        ui.append(f"backgroundColor:{bg}")
    if has_border:
        # Find border-width
        bw = "1px"
        for p, v in props:
            if "border-width" in p or (p == "border" and "solid" in v):
                if "border-width" in p:
                    bw = v.strip()
                break
        ui.append(f"borderWidthPopover:{bw}")
    if has_border_radius:
        br = "0"
        for p, v in props:
            if "radius" in p:
                br = v.strip()
                break
        ui.append(f"borderRadiusPopover:{br}")
    if has_padding:
        pad = "0"
        for p, v in props:
            if "padding" in p:
                pad = v.strip()
                break
        ui.append(f"paddingPopover:{pad}")
    if has_margin:
        mar = "0"
        for p, v in props:
            if "margin" in p:
                mar = v.strip()
                break
        ui.append(f"marginPopover:{mar}")
    if not ui:
        return None
    return "[" + ",".join(ui) + "]"


def expand_box_shorthand(prop_name, value):
    """Split a 1-4 value box shorthand (padding/margin/inset) into
    top/right/bottom/left longhand values, per CSS shorthand rules."""
    parts = value.split()
    if len(parts) == 1:
        top = right = bottom = left = parts[0]
    elif len(parts) == 2:
        top = bottom = parts[0]
        right = left = parts[1]
    elif len(parts) == 3:
        top = parts[0]
        right = left = parts[1]
        bottom = parts[2]
    elif len(parts) == 4:
        top, right, bottom, left = parts
    else:
        return None
    return [
        (f"{prop_name}-top", top),
        (f"{prop_name}-right", right),
        (f"{prop_name}-bottom", bottom),
        (f"{prop_name}-left", left),
    ]


_BORDER_STYLE_KEYWORDS = {
    "none", "solid", "dashed", "dotted", "double",
    "groove", "ridge", "inset", "outset", "hidden",
}


def expand_border_shorthand(value):
    """Split `border: <width> <style> <color>` (any order, any/all parts
    optional) into border-style/border-*-width/border-color longhand.
    Unlike the other box shorthands, `border` has no fixed value count, so
    tokens are classified by shape rather than position. Returns None for
    a value this can't confidently classify (e.g. contains a function)."""
    parts = value.split()
    style = width = color = None
    for tok in parts:
        low = tok.lower()
        if low in _BORDER_STYLE_KEYWORDS:
            style = low
        elif tok.startswith("#") or low.startswith(("rgb", "hsl", "var(", "color-mix(")) or low in ("currentcolor", "transparent"):
            color = tok
        elif re.match(r"^[\d.]+(px|rem|em|pt|%|ch|vw|vh)?$", tok) or low in ("thin", "medium", "thick"):
            width = tok
        else:
            return None
    result = []
    if style:
        result.append(("border-style", style))
    if width:
        for side in ("top", "right", "bottom", "left"):
            result.append((f"border-{side}-width", width))
    if color:
        result.append(("border-color", color))
    return result or None


def expand_shorthand(props):
    """Expand border, padding, margin shorthand to longhand."""
    result = []
    for prop, val in props:
        p = prop.strip().lower()
        v = val.strip()
        if p == "border":
            expanded = expand_border_shorthand(v)
            result.extend(expanded if expanded else [(prop, val)])
        elif p in ("padding", "margin"):
            expanded = expand_box_shorthand(p, v)
            result.extend(expanded if expanded else [(prop, val)])
        else:
            result.append((prop, val))
    return result


def main():
    css_path = sys.argv[1] if len(sys.argv) > 1 else "a.css"
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    custom_props = extract_custom_properties(strip_comments(css))

    # Multiple selectors (e.g. the outer wrapper AND its __widget) can resolve
    # to the same af2_id + state per component-selectors.md's "widgetAndText"
    # pattern. Merge their declarations by property name (later rule in
    # source order wins per-property) instead of letting one rule's whole
    # bracket clobber another's.
    merged = defaultdict(dict)  # (af2_id, attr) -> {prop: val}

    for selector, block, breakpoint_name in parse_css(css):
        resolved = resolve_selector(selector)
        if not resolved:
            continue
        af2_id, state = resolved
        props = parse_declarations(block, custom_props)
        if not props:
            continue
        props = expand_shorthand(props)
        attr = f"{breakpoint_name}_x0023_{state}"
        for prop, val in props:
            merged[(af2_id, attr)][prop.strip().lower()] = val

    nodes = defaultdict(dict)  # af2_id -> { attr -> (bracket, ui) }
    for (af2_id, attr), prop_map in merged.items():
        prop_list = list(prop_map.items())
        bracket = build_bracket(prop_list)
        if not bracket:
            continue
        ui = extract_ui_metadata(prop_list)
        nodes[af2_id][attr] = (bracket, ui)

    # Emit XML
    print('<?xml version="1.0" encoding="UTF-8"?>')
    print('<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"')
    print('    jcr:primaryType="sling:Folder">')
    print('    <jcr:content')
    print('        jcr:primaryType="nt:unstructured"')
    print('        rendition.handler.id="theme.structure">')
    print('        <components jcr:primaryType="nt:unstructured">')
    print('            <af2_guideContainer')
    print('                jcr:primaryType="nt:unstructured"')
    print('                component="core/fd/components/form/container/v2/container">')

    # Sort nodes for consistent output
    for af2_id in sorted(nodes.keys()):
        attrs = nodes[af2_id]
        parts = [f'                <{af2_id}',
                 '                    jcr:primaryType="nt:unstructured"']
        for attr in sorted(attrs.keys()):
            bracket, ui = attrs[attr]
            parts.append(f'                    {attr}="{xml_escape_attr(bracket)}"')
            if ui:
                parts.append(f'                    {attr}_x0023_ui="{xml_escape_attr(ui)}"')
        parts.append('                />')
        print("\n".join(parts))

    print('            </af2_guideContainer>')
    print('        </components>')
    print('        <assetLibrary jcr:primaryType="nt:unstructured"/>')
    print('    </jcr:content>')
    print('</jcr:root>')


if __name__ == "__main__":
    main()
