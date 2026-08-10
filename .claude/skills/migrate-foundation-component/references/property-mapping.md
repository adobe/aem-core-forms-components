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
| `jcr:title` (field title) | `jcr:title` | `jcr:title` (via label object) | Core wraps in label object with `value` and `visible` sub-properties |
| `mandatory` | `mandatory` | `required` | Aligned with HTML/JSON Schema standard |
| `placeholderText` | `placeholderText` | `placeholder` | Shortened to match HTML attribute |
| `bindRef` | `bindRef` | `name` | Core binds via `name`; `bindRef` is XFA-specific |
| `_value` | `_value` | `default` | Foundation prefixed `_` to avoid JCR conflicts; Core uses `default` |
| `shortDescription` | `shortDescription` | `tooltip` | Concept rename: short description = tooltip in Core |
| `longDescription` | `longDescription` | `description` | Concept rename |
| `shortVisible` | `shortVisible` | `tooltipVisible` | Renamed to match its field |
| `isTitleRichText` | `isTitleRichText` | `label.richText` sub-property | Moved into the label object |
| `hideTitle` | `hideTitle` | `label` sub-node with `visible=false` | Label is now an object |
| `maxChars` | `maxChars` | `maxLength` | Aligned with HTML5 `maxlength` |
| `validatePictureClause` | `validatePictureClause` | `pattern` | XFA picture clause → standard regex |
| `validatePictureClauseMessage` | `validatePictureClauseMessage` | constraint message for `pattern` | Goes into constraint messages map |
| `mandatoryMessage` | `mandatoryMessage` | constraint message for `required` | Same constraint messages map |
| `cssClassName` | `cssClassName` | *(Style System)* | Core uses Design Dialog Style System; see dropped properties |

## Properties Commonly Dropped

"Dropped" means the specific JCR property has no place on a Core JCR node. It does NOT mean the feature disappears. For every dropped property, the "Core provides this via" column is mandatory in the migration plan — leaving it blank is not acceptable.

| Foundation Property | JCR Name | Why Dropped | Core provides this via | Action required |
|--------------------|----------|-------------|------------------------|-----------------|
| `guideNodeClass` | `guideNodeClass` | Foundation-only; Sling Model resolution replaces this | `sling:resourceType` | None — Core resolves via resource type |
| `visibleExp` | `visibleExp` | Core does not evaluate this string at runtime | **Rules Editor** — Visibility rule; stored in `fd:rules` | Ensure Rules Editor tab is present in Core dialog |
| `enabledExp` | `enabledExp` | Same | **Rules Editor** — Enable rule | Same |
| `calculateExp` | `calculateExp` | Same | **Rules Editor** — Set Value of rule | Same |
| `initializeExp` | `initializeExp` | Same | **Rules Editor** — Initialize rule | Same |
| `sOM` | `sOM` | Auto-computed; never authored | **Core runtime** — computed from form schema | Nothing — Core computes automatically |
| `guideFieldType` | `guideFieldType` | Replaced by a different property | **`fieldType`** in `_cq_template.xml` (kebab-case) | Set correct `fieldType` |
| `fieldLayout` | `fieldLayout` | Foundation layout system; Core uses CSS/BEM | **HTL template structure** — layout baked into `.html` | Implement correct layout in HTL |
| `colspan` | `colspan` | Foundation grid system removed | **Container responsive grid** — managed at container level | Configure at container level |
| `css` (CSS Class field) | `css` | Arbitrary class injection is not a Core pattern | **Style System** — `_cq_design_dialog` with allowed styles | Implement `_cq_design_dialog` with Style System tab |
| `assistPriority` | `assistPriority` | Foundation accessibility priority; Core uses explicit ARIA | **Core ARIA attributes** — `aria-label`, `aria-describedby` set by shared templates and JS | Nothing — Core handles automatically |
| `xdpRef` | `xdpRef` | XFA template reference | Nothing (unless XFA support explicitly needed) | Flag for user review |
| `dorTemplateRef` | `dorTemplateRef` | Document of Record template ref | Separate concern in Core DOR templates | Flag for user review |
| `dorType` | `dorType` | DOR configuration; handled differently in Core | Core DOR templates | Flag for user review |
| `dorExclusion` | `dorExclusion` | DOR exclusion flag | Core DOR templates | Flag for user review |
| `wrapData` | `wrapData` | XFA data wrapping; not applicable | Nothing | No action needed |
| `allowedParents` | (metadata) | Foundation parsys constraint; Core uses policy | **Template policy** — component groups in `wcm/policies` | Add component group to template policy |

## Properties Requiring Per-Migration Review

These properties exist in some foundation components and need case-by-case evaluation:

| Foundation Property | Core Status | What to do |
|--------------------|-------------|-----------|
| `assistPriority` enum values | Supported, but enum values differ: Foundation uses `caption`, `toolTip`, `name`, `custom`; Core uses `LABEL`, `DESCRIPTION`, `NAME`, `CUSTOM` | Remap: `caption`→`LABEL`, `toolTip`→`DESCRIPTION`, `name`→`NAME`, `custom`→`CUSTOM` |
| `speak` / `custom` (screen reader text) | `custom` JCR property is the same in Core | Port directly; only the `assistPriority` enum needs remapping |
| `multiLine` + `allowRichText` | `multiLine` supported; `allowRichText` → `richText` | Port both; use the renamed key for rich text |
| `rows` / `cols` | No Core equivalent | Drop — textarea sizing is controlled by theme CSS |
| `displayPictureClause` | XFA picture syntax not parsed by Core | Migrate to `displayFormat` using ISO/standard format equivalent |
| `displayIsSameAsValidate` | No equivalent — `displayFormat` and `editFormat` are always independent in Core | Set both `displayFormat` and `editFormat` explicitly in the dialog |

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
