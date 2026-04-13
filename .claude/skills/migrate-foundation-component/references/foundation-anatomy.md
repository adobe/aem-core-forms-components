# Foundation Component Anatomy

Reference for the structure and patterns of AEM Foundation (Guide) Form Components. For standard foundation components, all data is embedded in `known-components.md`. This file documents the general patterns needed to analyze **custom** foundation components when the user provides source file paths.

## Repository Layout

In a typical `cq-guides` repository, foundation components are organized as:

```
content/src/main/resources/libs/fd/af/components/   — UI component definitions
bundles/aemds-guide-core/src/main/java/com/adobe/aemds/guide/common/  — Java models
```

## File Structure per Component

Every foundation component directory contains some or all of these files:

| File | Purpose | Required |
|------|---------|----------|
| `.content.xml` | Component metadata: title, icon, superType, componentGroup | Yes |
| `init.jsp` | Backend initialization via `guide:initializeBean` | Yes |
| `widget.jsp` | Rendering template (HTML output) | Yes |
| `_cq_dialog/.content.xml` | Touch UI dialog (Granite UI, modern) | Yes |
| `dialog.xml` | Classic ExtJS dialog (legacy, may not exist) | No |
| `_cq_template.xml` | Default properties for new instances | Yes |
| `_cq_styleConfig/.content.xml` | CSS selectors for styleable elements/states | Sometimes |
| `formatters.xml` | Display/validation pattern definitions | Sometimes |
| `icon.png` | Component icon (16x16 or 24x24) | No |

## Java Class Hierarchy

```
GuideNode (base for all guide components)
  ├── GuideField (abstract — all input fields)
  │     ├── GuideTextBox
  │     ├── GuideCheckBox
  │     ├── GuideRadioButton
  │     ├── GuideDropDownList
  │     ├── GuideDatePicker
  │     ├── GuideNumericBox
  │     ├── GuideNumericStepper
  │     ├── GuidePasswordBox
  │     ├── GuideFileUpload
  │     ├── GuideSwitch
  │     ├── GuideScribble
  │     └── GuideTermsAndConditions
  ├── GuideTextDraw (display-only text/HTML)
  ├── GuideSeparator (visual divider)
  ├── GuideImage (display image)
  ├── GuideButton (form actions)
  ├── GuideCaptcha (captcha widget)
  ├── GuideChart (data visualization)
  └── GuidePanel / GuideContainer (containers)
        ├── GuideItemsContainer
        └── GuideFragmentContainer
```

## Component Metadata (.content.xml) Pattern

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:description="Component description."
    jcr:primaryType="cq:Component"
    jcr:title="Component Title"
    allowedParents="[*/parsys,*/*layout]"
    componentGroup="Adaptive Form"
    cq:icon="iconName"
    sling:resourceSuperType="fd/af/components/guidefield"/>
```

Key attributes:
- `sling:resourceSuperType` — determines parent component (guidefield, guideNode, etc.)
- `componentGroup` — always `"Adaptive Form"` for foundation
- `cq:icon` — Coral icon name

## Initialization Pattern (init.jsp)

```jsp
<%@include file="/libs/fd/af/components/guidesglobal.jsp"%>
<guide:initializeBean name="guideField"
    className="com.adobe.aemds.guide.common.GuideTextBox"/>
```

The `className` attribute specifies which Java model to instantiate. The `name` attribute defines the EL variable used in `widget.jsp`.

## Widget Rendering Pattern (widget.jsp)

Foundation widget JSPs use:

| JSP Pattern | Purpose |
|-------------|---------|
| `${guideField.property}` | Access model property |
| `<c:if test="${condition}">` | Conditional rendering |
| `<c:choose>/<c:when>/<c:otherwise>` | Multi-branch conditional |
| `<c:forEach items="${list}" var="item">` | Iteration |
| `guide:encodeForHtmlAttr(value)` | XSS-safe attribute encoding |
| `guide:encodeForHtml(value)` | XSS-safe text encoding |
| `guide:filterHtml(value)` | XSS-safe HTML passthrough |
| `<%= GuideConstants.CONSTANT %>` | CSS class constants |

## Touch UI Dialog Pattern (_cq_dialog/.content.xml)

```xml
<jcr:root ...
    jcr:primaryType="nt:unstructured"
    jcr:title="Component Title"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container">
        <items jcr:primaryType="nt:unstructured">
            <accordion jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/accordion">
                <items jcr:primaryType="nt:unstructured">
                    <basic jcr:title="Basic" ...>
                        <!-- Component-specific fields -->
                    </basic>
                    <help jcr:title="Help Content" .../>
                    <accessibility jcr:title="Accessibility" .../>
                    <patterns jcr:title="Patterns" .../>
                    <styling jcr:title="Styling" .../>
                </items>
            </accordion>
        </items>
    </content>
</jcr:root>
```

Foundation dialogs use **accordion** layout; Core dialogs use **tabs** layout.

## Dialog Inclusion Pattern

Foundation dialogs share common config via `cqinclude`:
```xml
<xtype="cqinclude"
    path="/libs/fd/af/components/guidefield/dialog/items/title/items.infinity.json"/>
```

Core dialogs share via `granite/ui/components/coral/foundation/include`:
```xml
<sling:resourceType="granite/ui/components/coral/foundation/include"
    path="core/fd/components/form/base/v1/base/cq:dialog/content/items/tabs/items/basic/..."/>
```

## Datasource Pattern

Foundation datasources:
```xml
<datasource jcr:primaryType="nt:unstructured"
    sling:resourceType="fd/af/components/commons/datasources/propertyprovider"
    guideDataModel="basic"
    guideNodeClass="guideTextBox"
    type="formatters"/>
```

## Style Configuration Pattern

```xml
<!-- _cq_styleConfig/.content.xml -->
<jcr:root ...>
    <items>
        <widget_default label="Widget" selector=".textField input[type='text']"/>
        <widget_focus label="Widget:focus" selector=".textField input[type='text']:focus"/>
        <widget_disabled label="Widget:disabled"
            selector="[data-disabled='true'] .textField input[type='text']"/>
        <widget_error label="Widget:error"
            selector=".validation-failure .textField input[type='text']"/>
    </items>
</jcr:root>
```

## Property Access Pattern in Java

Foundation models read JCR properties via `resourceProps` (a ValueMap):

```java
public class GuideTextBox extends GuideField {
    public Boolean getMultiLine() {
        return resourceProps.get("multiLine", false);
    }
    public String getAutocomplete() {
        return resourceProps.get("autocomplete", String.class);
    }
    public Integer getHtml5MaxLength() {
        Integer maxChars = resourceProps.get("maxChars", Integer.class);
        // ... computation logic
        return htmlMaxLength;
    }
}
```

Core models use Sling Model annotations:
```java
@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
private Boolean multiLine;

public Boolean getMultiLine() {
    return multiLine;
}
```

## Event Listener Pattern

Foundation dialogs may define event listeners:
```xml
<granite:data jcr:primaryType="nt:unstructured"
    af.listeners.change="guidelib.touchlib.editLayer.dialogUtils.someFunction();"
    af.listeners.onload="guidelib.touchlib.editLayer.dialogUtils.someFunction();"/>
```

These may need to be replicated in Core editor clientlibs or can often be dropped if the Core dialog handles the UX differently.

## Template Pattern (_cq_template.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Text Box"
    guideNodeClass="guideTextBox"/>
```

The `guideNodeClass` maps to the foundation class name and is NOT needed in Core components.
