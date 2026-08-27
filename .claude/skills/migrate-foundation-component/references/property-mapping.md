# Foundation → Core Property Mapping

## Class Hierarchy Mapping

| Foundation Class | Core Base Class | Core Interface | Component Type |
|-----------------|-----------------|----------------|----------------|
| `GuideField` | `AbstractFieldImpl` | `Field` | Simple field |
| `GuideField` (with enum/options) | `AbstractOptionsFieldImpl` | `OptionsConstraint` | Options field |
| `GuideTextBox` | `AbstractFieldImpl` | `Field` + `StringConstraint` | Simple field |
| `GuideCheckBox` | `AbstractFieldImpl` | `Field` (boolean) | Simple field |
| `GuideRadioButton` | `AbstractOptionsFieldImpl` | `OptionsConstraint` | Options field |
| `GuideDropDownList` | `AbstractOptionsFieldImpl` | `OptionsConstraint` | Options field |
| `GuideDatePicker` | `AbstractFieldImpl` | `Field` + `DateConstraint` | Simple field |
| `GuideNumericBox` | `AbstractFieldImpl` | `Field` + `NumberConstraint` | Simple field |
| `GuideFileUpload` | `AbstractFieldImpl` | `Field` + `FileConstraint` | Simple field |
| `GuideButton` | `AbstractBaseImpl` | `Base` | Display-only (action) |
| `GuideTextDraw` | `AbstractBaseImpl` | `Base` | Display-only |
| `GuideSeparator` | `AbstractBaseImpl` | `Base` | Display-only |
| `GuideImage` | `AbstractBaseImpl` | `Base` | Display-only |
| `GuidePanel` | `AbstractContainerImpl` | `Container` | Container |
| `GuideContainer` | `AbstractContainerImpl` | `Container` | Container |
| `GuideCaptcha` | `AbstractFieldImpl` | `Field` | Simple field |

## FieldType Mapping

| Foundation `guideFieldType` | Core `FieldType` enum | FieldType string |
|----------------------------|-----------------------|------------------|
| `GUIDE_FIELD_TEXTBOX` | `TEXT_INPUT` | `text-input` |
| `GUIDE_FIELD_TEXTBOX` (multiLine) | `MULTILINE_INPUT` | `multiline-input` |
| `GUIDE_FIELD_NUMERIC_BOX` | `NUMBER_INPUT` | `number-input` |
| `GUIDE_FIELD_DATE_PICKER` | `DATE_INPUT` | `date-input` |
| `GUIDE_FIELD_CHECKBOX` | `CHECKBOX` | `checkbox` |
| `GUIDE_FIELD_CHECKBOX_GROUP` | `CHECKBOX_GROUP` | `checkbox-group` |
| `GUIDE_FIELD_RADIO_BUTTON` | `RADIO_GROUP` | `radio-group` |
| `GUIDE_FIELD_DROP_DOWN_LIST` | `DROP_DOWN` | `drop-down` |
| `GUIDE_FIELD_FILE_UPLOAD` | `FILE_INPUT` | `file-input` |
| `GUIDE_FIELD_BUTTON` | `BUTTON` | `button` |
| `GUIDE_FIELD_TEXT_DRAW` | `PLAIN_TEXT` | `plain-text` |
| `GUIDE_FIELD_IMAGE` | `IMAGE` | `image` |
| `GUIDE_FIELD_PANEL` | `PANEL` | `panel` |
| `GUIDE_FIELD_FORM` | `FORM` | `form` |
| (no equivalent) | `CHECKBOX_GROUP` | `checkbox-group` |

## Common Property Mapping — GuideField → Field/Base

The foundation base classes `GuideField` / `GuideNode` expose a set of common properties (title, mandatory, readOnly, visible, enabled, name, description, tooltip, default, placeholder, dataRef). Every one of these is already handled by the Core base classes, so they do **NOT** need custom migration — mapping a foundation field onto the correct base class carries them across automatically.

> **Do not maintain a duplicate list of the Core-side getters/JCR names here** — that data drifts as the framework evolves. The authoritative source of the Core base-class property surface is:
> - the base-interface / implementation hierarchy in the `create-core-component` skill (`references/component-anatomy.md` → "Interface Hierarchy" and "Implementation Hierarchy"), and
> - the interfaces themselves: `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/Base.java` and `Field.java`.
>
> Consult those to confirm the exact Core getter/JCR name and which base class owns it.

The only migration-specific knowledge (foundation property name → which Core base class already provides it) is:

| Foundation Property (JCR) | Provided by Core base class |
|---------------------------|-----------------------------|
| title (`jcr:title`) | `AbstractBaseImpl` (label) |
| mandatory | `AbstractBaseImpl` (via `BaseConstraint`) |
| readOnly | `AbstractFieldImpl` |
| visible | `AbstractFormComponentImpl` |
| enabled | `AbstractBaseImpl` |
| name | `AbstractFormComponentImpl` |
| description | `AbstractBaseImpl` |
| tooltip | `AbstractBaseImpl` |
| default (`value`) | `AbstractFieldImpl` |
| placeholder (`placeholderText`) | `AbstractFieldImpl` |
| dataRef (`bindRef`) | `AbstractFormComponentImpl` |

## Properties That Need Renaming

| Foundation Property | Foundation JCR | Core JCR | Notes |
|--------------------|---------------|----------|-------|
| `jcr:title` (field title) | `jcr:title` | `jcr:title` (via label) | Core wraps in label object |
| `mandatory` | `mandatory` | `required` | Name change |
| `placeholderText` | `placeholderText` | `emptyText` / `placeholder` | Check Core convention |
| `bindRef` | `bindRef` | `dataRef` | Core uses `dataRef` |
| `cssClassName` | `cssClassName` | *(handled differently)* | Core uses data-layer |

## Properties Commonly Dropped

These foundation properties are typically NOT migrated to Core:

| Foundation Property | JCR Name | Reason |
|--------------------|----------|--------|
| `guideNodeClass` | `guideNodeClass` | Foundation-only; Sling Model resolution replaces this |
| `xdpRef` | `xdpRef` | XFA template reference; only if XFA support needed |
| `dorTemplateRef` | `dorTemplateRef` | Document of Record template ref; separate concern in Core |
| `dorType` | `dorType` | DOR configuration; handled differently in Core |
| `dorExclusion` | `dorExclusion` | DOR exclusion; handled differently in Core |
| `fieldLayout` | `fieldLayout` | Foundation layout system; Core uses CSS/BEM |
| `allowedParents` | (metadata) | Foundation parsys constraint; Core uses policy |
| `wrapData` | `wrapData` | XFA data wrapping; not applicable |
| `assistPriority` | `assistPriority` | Foundation accessibility priority; Core uses explicit ARIA |
| `custom` | `custom` | Foundation custom object; Core uses `properties` |

## Component-Specific Property Mappings

> **The authoritative list of Core properties for any existing component is its own `README.md` — do not duplicate it here.** Each Core component documents every JCR/edit-dialog property it supports in:
>
> ```
> ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{component}/v{n}/{component}/README.md
> ```
>
> (e.g. `textinput/v1/textinput/README.md`, `radiobutton/v2/radiobutton/README.md`). When the foundation component maps to a Core component that already exists, **read that README** to get the current, authoritative property set and its exact JCR names. If the mapping target is a brand-new component, the `create-core-component` skill's `references/component-anatomy.md` (base-class property inventory) is the source of truth for inherited properties.
>
> What follows is **only** the foundation-specific transformation knowledge that is *not* recoverable from the Core README: renames, structural restructuring, and properties that must be dropped or computed. Match these against the property set you read from the README.

### GuideTextBox → TextInput
- `maxChars` → `maxLength` (rename; StringConstraint).
- `html5MaxLength` → computed via `@PostConstruct` (no direct JCR property).
- `multiLine` → not a boolean toggle in Core; select the `multiline-input` fieldType instead.
- `html5Type` → map to the Core fieldType rather than a stored property.
- `cols` → drop (CSS handles width); `rows` → carry over only for the multiline variant.
- `allowRichText` → no core equivalent; add as a custom property only if required.

### GuideCheckBox → Checkbox
- `enabledValue` / `disabledValue` → restructure into the options model (`enum[0]` / `enum[1]`); there are no scalar `*Value` JCR properties in Core.

### GuideRadioButton → RadioButton
- `items` (child nodes) → restructure into `enum` / `enumNames` arrays (structural change, not a rename).
- `orientation` → confirm against the RadioButton README (carried over where supported).

### GuideDropDownList → DropDown
- `items` (child nodes) → restructure into `enum` / `enumNames` arrays.
- `multiSelect` → in Core, multi-select is expressed through the field `type` (`array`); confirm the property name against the DropDown README.

### GuideDatePicker → DatePicker
- `minDate` / `maxDate` → `minimum` / `maximum` (rename; DateConstraint).
- `displayFormat` / `editFormat` → confirm the current names against the DatePicker README.

### GuideNumericBox → NumberInput
- `minValue` / `maxValue` → `minimum` / `maximum` (rename; NumberConstraint).
- `displayPattern` → `displayFormat` (rename); `editPattern` → merge into `displayFormat`.
- `leadDigits` / `fracDigits` → no direct equivalent; evaluate dropping or mapping to `step`.

### GuideFileUpload → FileInput
- `multiSelection` → expressed through the field `type` (`array`), not a boolean.
- `fileSizeLimit` → `maxFileSize` (rename); `acceptTypes` → `accept` (rename).
- Confirm exact names against the FileInput README (multiple versions exist — v1–v4).

### GuideButton → Button
- `submitUrl` → drop (submission is handled by events/rules in Core).
- `buttonType` → confirm against the Button README.

## JSP → HTL Expression Mapping

| Foundation JSP | Core HTL | Notes |
|---------------|----------|-------|
| `${guideField.property}` | `${componentname.property}` | Different EL variable |
| `<c:if test="${condition}">` | `<div data-sly-test="${condition}">` | Use `data-sly-test` |
| `<c:choose>/<c:when test="${a}">` | `<div data-sly-test.testA="${a}">` | Chain data-sly-test |
| `<c:otherwise>` | `<div data-sly-test="${!testA}">` | Negate prior tests |
| `<c:forEach items="${list}" var="item">` | `<div data-sly-list.item="${list}">` | Use data-sly-list |
| `<%= GuideConstants.GUIDE_FIELD_WIDGET %>` | `cmp-adaptiveform-{name}__widget` | BEM class |
| `guide:encodeForHtmlAttr(val)` | `${val @ context='attribute'}` | HTL context |
| `guide:encodeForHtml(val)` | `${val @ context='text'}` | HTL context |
| `guide:filterHtml(val)` | `${val @ context='html'}` | HTL context |
| `<%@include file="..."%>` | `<sly data-sly-use="...">` | HTL use |

## CSS Class Mapping

| Foundation CSS | Core BEM | Used For |
|---------------|----------|----------|
| `guideFieldWidget` | `cmp-adaptiveform-{name}__widget` | Main interactive element |
| `guideFieldLabel` | `cmp-adaptiveform-{name}__label` | Label element |
| `guideFieldDescription` | `cmp-adaptiveform-{name}__longdescription` | Description text |
| `guideFieldError` | `cmp-adaptiveform-{name}__errormessage` | Error display |
| `guideFieldTooltip` | `cmp-adaptiveform-{name}__shortdescription` | Tooltip |
| `guideFieldQuestionMark` | `cmp-adaptiveform-{name}__questionmark` | Help toggle |
| `textField` | `cmp-adaptiveform-{name}` | Root container |

## Granite UI Dialog Field Mapping

Foundation and Core both use Granite UI components for dialogs. These translate directly:

| Foundation Dialog Field | Core Dialog Field | Notes |
|------------------------|-------------------|-------|
| `granite/ui/components/coral/foundation/form/textfield` | Same | Direct |
| `granite/ui/components/coral/foundation/form/checkbox` | Same | Direct |
| `granite/ui/components/coral/foundation/form/select` | Same | Direct |
| `granite/ui/components/coral/foundation/form/numberfield` | Same | Direct |
| `granite/ui/components/coral/foundation/form/datepicker` | Same | Direct |
| `granite/ui/components/coral/foundation/form/textarea` | Same | Direct |
| `granite/ui/components/coral/foundation/form/hidden` | Same | Direct |
| `granite/ui/components/coral/foundation/form/pathfield` | Same | Direct |
| Foundation accordion layout | Core tabs layout | Structural change |
| Foundation `cqinclude` includes | Core `include` resourceType | Different include mechanism |

## Validation Constraint Mapping

| Foundation Validation | Core Constraint Interface | Notes |
|----------------------|--------------------------|-------|
| `validateExp` (regex) | `StringConstraint.pattern` | Direct regex |
| `minLength` / `maxLength` | `StringConstraint` | Direct |
| `minValue` / `maxValue` | `NumberConstraint.minimum/maximum` | Rename |
| `minDate` / `maxDate` | `DateConstraint` | Rename |
| `mandatory` | `BaseConstraint.required` | Rename |
| `validateMessage` | `constraintMessages` | Map to constraint messages |
| `mandatoryMessage` | `constraintMessages.required` | Map to specific message |
| Foundation display patterns | `displayFormat` | Direct or map |
| Foundation validate patterns | `validationExpression` | Map to expression |
