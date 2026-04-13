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

These properties exist in the foundation base `GuideField` / `GuideNode` and are already handled by Core base classes (`AbstractFieldImpl`, `AbstractBaseImpl`). They do NOT need custom migration:

| Foundation Property | JCR Name | Core Equivalent | Handled By |
|--------------------|----------|-----------------|------------|
| `getTitle()` / `jcr:title` | `jcr:title` | `getLabel().getValue()` | `AbstractBaseImpl` |
| `getIsRequired()` | `mandatory` | `isRequired()` | `AbstractBaseImpl` (via `BaseConstraint`) |
| `getIsReadOnly()` | `readOnly` | `isReadOnly()` | `AbstractFieldImpl` |
| `getVisible()` | `visible` | `isVisible()` | `AbstractFormComponentImpl` |
| `getEnabled()` | `enabled` | `isEnabled()` | `AbstractBaseImpl` |
| `getName()` | `name` | `getName()` | `AbstractFormComponentImpl` |
| `getDescription()` | `description` | `getDescription()` | `AbstractBaseImpl` |
| `getToolTip()` | `tooltip` | `getTooltip()` | `AbstractBaseImpl` |
| `getDefault()` | `value` | `getDefault()` | `AbstractFieldImpl` |
| `getPlaceHolder()` | `placeholderText` | `getPlaceHolder()` | `AbstractFieldImpl` |
| `getDataRef()` | `bindRef` / `dataRef` | `getDataRef()` | `AbstractFormComponentImpl` |

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

### GuideTextBox → TextInput

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `multiLine` | `multiLine` | Boolean | `false` | `multiLine` | Direct (separate fieldType: `multiline-input`) |
| `allowRichText` | `allowRichText` | Boolean | `false` | `richTextContent` / custom | Custom property |
| `maxChars` | `maxChars` | Integer | null | `maxLength` (StringConstraint) | Rename |
| `minLength` | `minLength` | Integer | null | `minLength` (StringConstraint) | Direct |
| `html5MaxLength` | derived | Integer | null | *(computed)* | PostConstruct logic |
| `autocomplete` | `autocomplete` | String | null | `autocomplete` | Direct |
| `html5Type` | `html5Type` | String | `"text"` | *(use fieldType)* | Map to fieldType |
| `rows` | `rows` | Integer | null | `rows` / custom | Custom if multiline |
| `cols` | `cols` | Integer | null | *(CSS handles)* | Drop (use CSS) |

### GuideCheckBox → Checkbox

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `enabledValue` | `enabledValue` | String | `"on"` | `enum[0]` | Map to options |
| `disabledValue` | `disabledValue` | String | `"off"` | `enum[1]` | Map to options |

### GuideRadioButton → RadioButton

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `items` (child nodes) | child nodes | Nodes | — | `enum` / `enumNames` | Restructure |
| `orientation` | `orientation` | String | `"horizontal"` | `orientation` | Direct |

### GuideDropDownList → DropDown

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `items` (child nodes) | child nodes | Nodes | — | `enum` / `enumNames` | Restructure |
| `multiSelect` | `multiSelect` | Boolean | `false` | `multiSelect` / `type: array` | Direct |

### GuideDatePicker → DatePicker

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `minDate` | `minDate` | String | null | `minimum` (DateConstraint) | Rename |
| `maxDate` | `maxDate` | String | null | `maximum` (DateConstraint) | Rename |
| `displayFormat` | `displayFormat` | String | null | `displayFormat` | Direct |
| `editFormat` | `editFormat` | String | null | `editFormat` | Direct |

### GuideNumericBox → NumberInput

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `minValue` | `minValue` | Number | null | `minimum` (NumberConstraint) | Rename |
| `maxValue` | `maxValue` | Number | null | `maximum` (NumberConstraint) | Rename |
| `displayPattern` | `displayPattern` | String | null | `displayFormat` | Rename |
| `editPattern` | `editPattern` | String | null | *(use displayFormat)* | Merge |
| `leadDigits` | `leadDigits` | Integer | null | Custom or drop | Evaluate |
| `fracDigits` | `fracDigits` | Integer | null | Custom or `step` | Evaluate |

### GuideFileUpload → FileInput

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `multiSelection` | `multiSelection` | Boolean | `false` | `type: "array"` | Map to schema type |
| `fileSizeLimit` | `fileSizeLimit` | Long | null | `maxFileSize` | Rename |
| `acceptTypes` | `acceptTypes` | String[] | null | `accept` | Rename |

### GuideButton → Button

| Foundation | JCR Name | Type | Default | Core Equivalent | Action |
|-----------|----------|------|---------|-----------------|--------|
| `buttonType` | `buttonType` | String | `"button"` | `buttonType` | Direct |
| `submitUrl` | `submitUrl` | String | null | *(handled by events/rules)* | Drop |

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
