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
    (r"^\[data-cmp-enabled\]:not\(\[data-cmp-enabled=true\]\) \.cmp-adaptiveform-button__widget$", ("af2_button", "disabled")),
    (r"^\.cmp-adaptiveform-button__text$", ("af2_buttontext", "default")),
    (r"^\.cmp-adaptiveform-button__longdescription$", ("af2_buttondescriptionlong", "default")),
    (r"^\.cmp-adaptiveform-button__shortdescription$", ("af2_buttondescriptionshort", "default")),
    (r"^\.cmp-adaptiveform-button__questionmark$", ("af2_buttonhelpicon", "default")),
    (r"^\.cmp-adaptiveform-button__help-container$", ("af2_buttonhelpcontainer", "default")),
    # Input fields - widget
    (r"^\.cmp-adaptiveform-textinput__widget$", ("af2_textinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-numberinput__widget$", ("af2_numberinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-emailinput__widget$", ("af2_emailinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-telephoneinput__widget$", ("af2_telephoneinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datepicker__widget$", ("af2_datepickerwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-dropdown__widget$", ("af2_dropdownwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datetime__widget$", ("af2_datetimewidgetandtext", "default")),
    (r"^textarea\.cmp-adaptiveform-textinput__widget$", ("af2_textareawidgetandtext", "default")),
    # Input fields - root (widgetAndText)
    (r"^\.cmp-adaptiveform-textinput$", ("af2_textinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-numberinput$", ("af2_numberinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-emailinput$", ("af2_emailinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-telephoneinput$", ("af2_telephoneinputwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datepicker$", ("af2_datepickerwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-dropdown$", ("af2_dropdownwidgetandtext", "default")),
    (r"^\.cmp-adaptiveform-datetime$", ("af2_datetimewidgetandtext", "default")),
    # Input fields - data-cmp-valid states
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
    (r"^\.cmp-adaptiveform-radiobutton__widget$", ("af2_radiobuttonwidgetandtext", "default")),
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
]

def hex_to_rgb(hex_val):
    """Convert #RRGGBB or #RGB to rgb(r,g,b). Commas escaped in normalize_prop."""
    h = hex_val.lstrip("#")
    if len(h) == 6:
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    elif len(h) == 3:
        r, g, b = int(h[0]*2, 16), int(h[1]*2, 16), int(h[2]*2, 16)
    else:
        return hex_val
    return f"rgb({r},{g},{b})"

def normalize_prop(prop, val):
    """Normalize CSS property for bracket format. Convert hex to rgb, escape commas."""
    prop = prop.strip().lower()
    val = val.strip()
    # Skip url(), complex values
    if "url(" in val or "gradient" in val:
        return None
    # Convert hex to rgb (returns rgb(r,g,b) with raw commas)
    hex_match = re.search(r"#([0-9a-fA-F]{3,8})\b", val)
    if hex_match:
        val = re.sub(r"#([0-9a-fA-F]{3,8})\b", lambda m: hex_to_rgb(m.group(0)), val)
    # Escape commas in values for JCR bracket format
    val = val.replace(",", "\\,")
    return f"{prop}:{val}"

def parse_css(content):
    """Parse CSS into (selector, props) list. Skip @media for now."""
    rules = []
    # Remove @media blocks for simplicity
    content = re.sub(r"@media[^{]+\{[^}]*\}", "", content, flags=re.DOTALL)
    # Match selector { ... }
    pattern = re.compile(r"([^{]+)\{([^}]*)\}", re.DOTALL)
    for m in pattern.finditer(content):
        selector = m.group(1).strip().strip(",").strip()
        # Take first selector if comma-separated
        if "," in selector:
            for s in selector.split(","):
                s = s.strip()
                if s and s.startswith(".cmp-"):
                    rules.append((s, m.group(2)))
        else:
            if selector.startswith(".cmp-") or "cmp-adaptiveform" in selector or "cmp-container" in selector:
                rules.append((selector, m.group(2)))
    return rules

def resolve_selector(sel):
    """Resolve selector to (af2_id, state)."""
    sel = sel.strip()
    for pattern, (af2_id, state) in SELECTOR_MAP:
        if re.match(pattern, sel):
            return (af2_id, state)
    return None

def parse_declarations(block):
    """Parse CSS declarations into list of (prop, val)."""
    props = []
    for part in block.split(";"):
        part = part.strip()
        if ":" in part:
            idx = part.index(":")
            prop, val = part[:idx], part[idx+1:].strip()
            if prop and val:
                props.append((prop, val))
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

def escape_commas(val):
    """Escape commas for bracket format: , -> \\,"""
    return val.replace(",", "\\,")

def extract_ui_metadata(props):
    """Extract UI metadata (popover, backgroundColor) from props."""
    ui = []
    has_border = any("border" in p for p, _ in props)
    has_border_radius = any("radius" in p for p, _ in props)
    has_padding = any("padding" in p for p, _ in props)
    has_margin = any("margin" in p for p, _ in props)
    bg = None
    for p, v in props:
        if "background" in p and "color" in p.lower() and "url" not in v:
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

def expand_shorthand(props):
    """Expand border, padding, margin shorthand to longhand."""
    result = []
    for prop, val in props:
        p = prop.strip().lower()
        v = val.strip()
        if p == "border" and "solid" in v:
            parts = v.split()
            width = "1px"
            color = "#000"
            for x in parts:
                if x.endswith("px") or x.endswith("rem"):
                    width = x
                elif x.startswith("#") or x in ("solid", "none"):
                    if x.startswith("#"):
                        color = x
            result.extend([
                ("border-style", "solid"),
                ("border-top-width", width),
                ("border-right-width", width),
                ("border-bottom-width", width),
                ("border-left-width", width),
                ("border-color", color),
            ])
        elif p == "padding" and not any(x in p for x in ["top", "right", "bottom", "left"]):
            result.extend([
                ("padding-top", v),
                ("padding-right", v),
                ("padding-bottom", v),
                ("padding-left", v),
            ])
        elif p == "margin" and not any(x in p for x in ["top", "right", "bottom", "left"]):
            result.extend([
                ("margin-top", v),
                ("margin-right", v),
                ("margin-bottom", v),
                ("margin-left", v),
            ])
        else:
            result.append((prop, val))
    return result

def main():
    css_path = sys.argv[1] if len(sys.argv) > 1 else "a.css"
    with open(css_path, "r") as f:
        css = f.read()

    nodes = defaultdict(dict)  # af2_id -> { state -> (bracket, ui) }

    for selector, block in parse_css(css):
        resolved = resolve_selector(selector)
        if not resolved:
            continue
        af2_id, state = resolved
        props = parse_declarations(block)
        if not props:
            continue
        props = expand_shorthand(props)
        bracket = build_bracket(props)
        if not bracket:
            continue
        ui = extract_ui_metadata(props)
        attr = f"default_x0023_{state}"
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
            parts.append(f'                    {attr}="{bracket}"')
            if ui:
                parts.append(f'                    {attr}_x0023_ui="{ui}"')
        parts.append('                />')
        print("\n".join(parts))

    print('            </af2_guideContainer>')
    print('        </components>')
    print('        <assetLibrary jcr:primaryType="nt:unstructured"/>')
    print('    </jcr:content>')
    print('</jcr:root>')

if __name__ == "__main__":
    main()
