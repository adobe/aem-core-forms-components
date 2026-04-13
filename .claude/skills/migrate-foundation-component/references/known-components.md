# Known Foundation Components — Embedded Reference

Complete property, dialog, and rendering data for all standard AEM Foundation (Guide) Form Components. When migrating a known component listed here, use this data directly instead of reading from an external repository.

---

## Base Classes

### GuideNode (Root Base)

**Hierarchy:** `GuideNode extends WCMUsePojo implements Serializable, StyledFDField`

**JCR Properties (inherited by all components):**

| Property | JCR Name | Type | Default |
|----------|----------|------|---------|
| title | `jcr:title` | String | `" "` |
| description | `jcr:description` | String | null |
| name | `name` | String | (derived) |
| cssClassName | `cq:cssClass` | String | `""` |
| visibleExp | `visibleExp` | String | `""` |
| enabledExp | `enabledExp` | String | `""` |
| isTitleRichText | `isTitleRichText` | Boolean | `false` |
| bindRef | `bindRef` | String | null |
| nodeClass | (GuideConstants) | String | `""` |
| appearance | `appearance` | String | `""` |
| navTitle | `navTitle` | String | null |
| colspan | `colspan` | String→Integer | `"1"` |
| height | `height` | String | `""` |
| width | `width` | String | `""` |
| version | `fd:version` | String | LEGACY_AF_SPEC_VERSION |

---

### GuideField (Base Field Class)

**Hierarchy:** `GuideField extends GuideNode`

**JCR Properties (inherited by all field components):**

| Property | JCR Name | Type | Default |
|----------|----------|------|---------|
| mandatory | `mandatory` | Boolean | `false` |
| readOnly | (inherited) | Boolean | `false` |
| autofillFieldKeyword | `autofillFieldKeyword` | String | `"off"` |
| autocomplete | `autocomplete` | Boolean | `false` |
| fieldLayout | `fieldLayout` | String | `""` |
| hideTitle | `hideTitle` | Boolean | `false` |
| shortDescription | `shortDescription` | String | `""` |
| longDescription | `longDescription` | String | `""` |
| shortVisible | `shortVisible` | Boolean | `false` |
| value | `_value` | String | null |
| placeholderText | `placeholderText` | String | `""` |
| mandatoryMessage | `mandatoryMessage` | String | null |
| validateExpMessage | `validateExpMessage` | String | null |
| validatePictureClauseMessage | `validatePictureClauseMessage` | String | null |

**Key Methods:**
- `getLabelForId()` → returns `getId() + "_widget"`
- `isMandatory()` → reads `mandatory` property
- `getIsRequired()` / `getIsReadOnly()` → boolean state

---

## Field Components

### GuideTextBox

**Foundation Directory:** `guidetextbox`
**Title:** Text Box | **Icon:** `aBC` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field to capture text strings
**Core Mapping:** TextInput → `AbstractFieldImpl` + `StringConstraint` → FieldType `text-input` / `multiline-input`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| multiLine | `multiLine` | Boolean | `false` | Direct (controls fieldType) |
| allowRichText | `allowRichText` | Boolean | `false` | Custom property |
| rows | `rows` | int | `1` | Custom (multiline only) |
| cols | `cols` | int | `35` | Drop (use CSS) |
| maxChars | `maxChars` | Integer | null | Rename → `maxLength` (StringConstraint) |
| minLength | `minLength` | Integer | null | Direct (StringConstraint) |
| html5Type | `html5Type` | String | `"text"` | Map to fieldType |

**Computed Logic:**
- `getHtml5MaxLength()`: Checks feature toggle `FT_MAXLENGTH_ANDROID_FIX_DISABLED`

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./html5Type` | checkbox | Use HTML5 Input Type |
| `./_value` | textfield | Default Value |
| `./multiLine` | checkbox | Allow multiple lines |
| `./allowRichText` | checkbox | Allow Rich Text |
| `./autocomplete` | checkbox | Enable Autofill |
| `./autofillFieldKeyword` | autocomplete | Autofill Attribute |
| `./maxChars` | numberfield | Maximum Number of Characters |
| `./minLength` | numberfield | Minimum Number of Characters |
| `./length` | numberfield | Exact Number of Characters |
| `./displayPatternType` | select | Display Pattern Type |
| `./displayPictureClause` | textfield | Display Pattern |
| `./validationPatternType` | select | Validation Pattern Type |
| `./validatePictureClause` | textfield | Validation Pattern |
| `./validatePictureClauseMessage` | textarea | Error Message |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET textField">`
- Branch 1 (`allowRichText`): `<div>` with rich text editor widget
- Branch 2 (`multiLine`): `<textarea>` with optional maxlength, rows, cols
- Branch 3 (default): `<input type="text">` with maxlength
- Common attrs: `id="{id}_widget"`, `name`, `value`, `placeholder`, `autocomplete`, `aria-describedby="{labelForId}_desc"`

---

### GuideCheckBox

**Foundation Directory:** `guidecheckbox`
**Title:** Check Box | **Icon:** `select` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add checkboxes to select one or more of the available options
**Core Mapping:** CheckboxGroup → `AbstractOptionsFieldImpl` → FieldType `checkbox-group`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| options | `options` | String[] | null | Map → `enum`/`enumNames` |
| richTextOptions | `richTextOptions` | Boolean | `false` | Custom property |
| alignment | `alignment` | String | `"guideFieldHorizontalAlignment"` | Map → `orientation` |

**Key Methods:**
- `getLabelForId()` → returns `getId()` (overrides base)
- `getOptions()` → parses `options` String[] into Map
- `getGuideFieldType()` → `GUIDE_FIELD_CHECKBOXGROUP`

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./_value` | textfield | Default Value |
| `./options` | multifield | Items (value=text format) |
| `./richTextOptions` | checkbox | Allow Rich Text for Options |
| `./alignment` | radiogroup | Item Alignment |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_CHECKBOXGROUP_ITEMS">`
- forEach over `guideField.options`:
  - `<div class="GUIDE_FIELD_CHECKBOX_ITEM AF_CHECKBOX_ITEM {alignment}">`
  - `<input type="checkbox" id="{id}_{counter}_widget" name="{name}" value="{key}">`
  - `<label>` with option text (rich text or plain)
- `aria-describedby="{labelForId}_desc"`

---

### GuideRadioButton

**Foundation Directory:** `guideradiobutton`
**Title:** Radio Button | **Icon:** `target` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add two or more radio buttons for users to select one of the available options
**Core Mapping:** RadioButton → `AbstractOptionsFieldImpl` → FieldType `radio-group`

**Hierarchy:** `GuideRadioButton extends GuideCheckBox`

**Component-Specific JCR Properties:**
- Inherits all from GuideCheckBox (options, richTextOptions, alignment)
- No additional properties

**Dialog Fields:** Inherits from guidecheckbox with includes, plus accessibility fields (assistPriority, custom text)

**Widget Rendering (JSP):**
- Same structure as checkbox but with `<input type="radio">`
- Root: `<div class="GUIDE_FIELD_RADIOBUTTONGROUP_ITEMS">`
- Items: `<div class="GUIDE_FIELD_RADIOBUTTON_ITEM">`

---

### GuideDropDownList

**Foundation Directory:** `guidedropdownlist`
**Title:** Drop-down List | **Icon:** `dropdown` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a drop-down list to select one of the available options
**Core Mapping:** DropDown → `AbstractOptionsFieldImpl` → FieldType `drop-down`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| options | `options` | String[] | null | Map → `enum`/`enumNames` |
| optionsLoadPath | `optionsLoadPath` | String | null | Custom (dynamic datasource) |
| isMultiSelect | (derived) | Boolean | `false` | Direct → `multiSelect` |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./multiSelect` | checkbox | Allows multiple selection |
| `./options` | multifield | Items (value=text format) |
| `./_value` | textfield | Default Value |
| `./optionsLoadPath` | textfield | Items Load Path |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET dropDownList">`
- `<select id="{id}_widget" name="{name}" multiple="{isMultiSelect}">`
- Optional placeholder `<option>` if placeholderText set
- forEach over options with optgroup support
- `aria-describedby="{labelForId}_desc"`

---

### GuideDatePicker

**Foundation Directory:** `guidedatepicker`
**Title:** Date Picker | **Icon:** `viewBiWeek` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field with a calendar widget to select a date
**Core Mapping:** DatePicker → `AbstractFieldImpl` + `DateConstraint` → FieldType `date-input`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| html5Type | `html5Type` | String | `"text"` | Map to fieldType |
| minimum | `minimum` | String | `""` | Direct (DateConstraint) |
| maximum | `maximum` | String | `""` | Direct (DateConstraint) |
| exclusiveMinimum | `exclusiveMinimum` | Boolean | `false` | Direct (DateConstraint) |
| exclusiveMaximum | `exclusiveMaximum` | Boolean | `false` | Direct (DateConstraint) |
| dateDisplayFormat | `dateDisplayFormat` | String | `"date{M/D/YYYY}"` | Map → `displayFormat` |
| placeholderMonth | `placeholderMonth` | String | `""` | Custom |
| placeholderDay | `placeholderDay` | String | `""` | Custom |
| placeholderYear | `placeholderYear` | String | `""` | Custom |
| titleMonth | `titleMonth` | String | `""` | Custom |
| titleDay | `titleDay` | String | `""` | Custom |
| titleYear | `titleYear` | String | `""` | Custom |
| hideTitleDate | `hideTitleDate` | Boolean | `false` | Custom |

**Computed Logic:**
- `getMaximumDate()`: If `exclusiveMaximum`, subtracts 1 day
- `getMinimumDate()`: If `exclusiveMinimum`, adds 1 day
- `getDateInputOptions()`: Returns JSON with dateFormat, placeholders, labels

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./placeholderText` | textfield | Placeholder Text |
| `./_value` | textfield | Default Value (yyyy-mm-dd) |
| `./defaultToCurrentDate` | checkbox | Set current date as default |
| `./minimum` | textfield | Minimum Value (yyyy-mm-dd) |
| `./exclusiveMinimum` | checkbox | Exclude minimum value |
| `./maximum` | textfield | Maximum Value (yyyy-mm-dd) |
| `./exclusiveMaximum` | checkbox | Exclude maximum value |
| `./displayPatternType` | select | Display Pattern Type |
| `./displayPictureClause` | textfield | Display Pattern |
| `./validationPatternType` | select | Validation Pattern Type |
| `./validatePictureClause` | textfield | Validation Pattern |
| `./editPatternType` | select | Edit Pattern Type |
| `./editPictureClause` | textfield | Edit Pattern |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET dateTimeEdit">`
- Edit mode: `<input type="text">` with datepicker calendar icon
- Runtime: `<input type="date">` with min/max attributes (native HTML5)
- `aria-labelledby="{labelForId}_desc"`, `placeholder`

---

### GuideNumericBox

**Foundation Directory:** `guidenumericbox`
**Title:** Numeric Box | **Icon:** `123` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field to capture numbers
**Core Mapping:** NumberInput → `AbstractFieldImpl` + `NumberConstraint` → FieldType `number-input`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| html5Type | `html5Type` | String | `"text"` | Map to fieldType |
| minimum | `minimum` | String | `""` | Direct (NumberConstraint) |
| maximum | `maximum` | String | `""` | Direct (NumberConstraint) |
| exclusiveMinimum | `exclusiveMinimum` | Boolean | `false` | Direct (NumberConstraint) |
| exclusiveMaximum | `exclusiveMaximum` | Boolean | `false` | Direct (NumberConstraint) |
| dataType | `dataType` | String | null | Custom (decimal/integer/float) |
| leadDigits | `leadDigits` | Integer | null | Custom or drop |
| fracDigits | `fracDigits` | Integer | null | Custom or `step` |

**Computed Logic:**
- `getMaximumValue()`: If `exclusiveMaximum`, decrements by 1
- `getMinimumValue()`: If `exclusiveMinimum`, increments by 1

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./html5Type` | checkbox | Use HTML5 Number Input Type |
| `./dataType` | select | Data Type |
| `./_value` | numberfield | Default Value |
| `./leadDigits` | numberfield | Lead digits |
| `./fracDigits` | numberfield | Frac digits |
| `./minimum` | numberfield | Minimum Value |
| `./exclusiveMinimum` | checkbox | Exclude minimum value |
| `./maximum` | numberfield | Maximum Value |
| `./exclusiveMaximum` | checkbox | Exclude maximum value |
| `./displayPatternType` | select | Display Pattern Type |
| `./displayPictureClause` | textfield | Display Pattern |
| `./validationPatternType` | select | Validation Pattern Type |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET numericInput">`
- `<input type="number" or "text">` with min, max, step="any"
- `aria-describedby="{labelForId}_desc"`

---

### GuideNumericStepper

**Foundation Directory:** `guidenumericstepper`
**Title:** Numeric Stepper | **Icon:** `chevronUpDown` | **SuperType:** `fd/af/components/guidenumericbox`
**Description:** Add a field to type in a number or use + and - to increase and decrease numbers
**Core Mapping:** NumericStepper → `AbstractFieldImpl` + `NumberConstraint` → FieldType `number-input`

**Hierarchy:** `GuideNumericStepper extends GuideNumericBox`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| stepSize | `stepSize` | String→Float | `"1"` | Map → `step` |
| incIcon | `incIcon` | String | `"ui-icon-plusthick"` | Drop (Core uses CSS) |
| decIcon | `decIcon` | String | `"ui-icon-minusthick"` | Drop (Core uses CSS) |

**Dialog Fields:** Extends guidenumericbox, adds `./stepSize` (numberfield, label: "Step Value")

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET guideNumericStepper">`
- `data-af-widgetname="numericStepper"`, `data-af-widgetoptions` (JSON)
- `<input>` with type from html5Type

---

### GuideFileUpload

**Foundation Directory:** `guidefileupload`
**Title:** File Attachment | **Icon:** `attach` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a button to upload one or more files as form attachment
**Core Mapping:** FileInput → `AbstractFieldImpl` + `FileConstraint` → FieldType `file-input`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| mimeType | `mimeType` | String[] | `[]` | Rename → `accept` |
| buttonText | `buttonText` | String | null | Custom property |
| multiSelection | `multiSelection` | String→Boolean | `"false"` | Map → `type: "array"` |
| disableDoubleExtensionFiles | `disableDoubleExtensionFiles` | String→Boolean | `"false"` | Custom property |
| fileSizeLimit | `fileSizeLimit` | Long | null | Rename → `maxFileSize` |
| showComment | `showComment` | Boolean | null | Custom or drop |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./multiSelection` | checkbox | Allow multiple files |
| `./disableDoubleExtensionFiles` | checkbox | Disable Double Extension Files |
| `./buttonText` | textfield | Upload Button Title |
| `./fileSizeLimit` | numberfield | Maximum File Size (MB) |
| `./mimeType` | multifield | Supported File Types |
| `./showComment` | checkbox | Show upload comments |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET afFileUpload">`
- `<input type="file" id="{id}_widget" accept="{mimeType}" multiple="{multiSelection}" tabindex="-1">`
- `<button class="button-default button-medium guide-fu-attach-button">` with buttonText
- `<ul class="guide-fu-fileItemList">` for file list

---

### GuidePasswordBox

**Foundation Directory:** `guidepasswordbox`
**Title:** Password Box | **Icon:** `key` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field to capture a password
**Core Mapping:** PasswordInput → `AbstractFieldImpl` → FieldType `text-input` (password variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| submitPassword | `submitPassword` | Boolean | null | Custom property |

**Dialog Fields:** `./submitPassword` (checkbox, label: "Include password in the data submission")

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET defaultWidget">`
- `<input type="password" id="{id}_widget" name="{name}" placeholder="{placeholderText}">`
- `aria-labelledby="{labelForId}_desc"`

---

### GuideSwitch

**Foundation Directory:** `guideswitch`
**Title:** Switch | **Icon:** `switch` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a switch for users to toggle between two options
**Core Mapping:** Switch → `AbstractOptionsFieldImpl` → FieldType `checkbox` (toggle variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| options | `options` | String[] | null | Map → `enum`/`enumNames` |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./_value` | textfield | Default Value |
| `./options` | multifield | Items (value=text format) |
| `./assistPriority` | select | Screen reader precedence |
| `./custom` | multifield | Custom text |

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET guideSwitch">`
- `data-af-widgetname="guideSwitch"`
- `<input type="checkbox" id="{id}__widget" name="{name}" value="{value}">`

---

### GuideScribble

**Foundation Directory:** `guidescribble`
**Title:** Scribble Signature | **Icon:** `scribble` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field to capture scribble signature
**Core Mapping:** Scribble → `AbstractFieldImpl` → FieldType `file-input` (signature variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| aspectRatio | `aspectRatio` | Double | DEFAULT_ASPECT_RATIO | Custom property |

**Dialog Fields:** `./aspectRatio` (numberfield, label: "Aspect Ratio", required)

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET ScribbleImageField">`
- `data-guide-aspect-ratio="{aspectRatio}"`
- `<img id="{id}_widget" name="{name}" class="emptyScribble">`
- `aria-labelledby="{labelForId}_desc"`

---

## Display-Only Components

### GuideButton

**Foundation Directory:** `guidebutton`
**Title:** Button | **Icon:** `button` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add an interactive button for invoking an action
**Core Mapping:** Button → `AbstractBaseImpl` → FieldType `button`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| buttonType | `buttonType` | String | `"button-default"` | Drop (deprecated) |
| buttonSize | `buttonSize` | String | `"button-medium"` | Drop (deprecated) |
| type | `type` | String | `"button"` | Direct → `buttonType` |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./type` | select | Button Type |

Options: button, submit, reset, save, movePrev, moveNext

**Dialog Notes:** Most standard fields hidden (fieldLayout, hideTitle, required, placeholder, etc.). `excludeFromDor` checked by default.

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET GUIDE_FIELD_BUTTON_WIDGET">`
- `<button class="{buttonType} {buttonSize} {type}" type="submit|button" id="{id}_widget">`
- `<span class="iconButton-icon">` + `<span class="iconButton-label">` with title (rich text or plain)

---

### GuideTextDraw

**Foundation Directory:** `guidetextdraw`
**Title:** Text | **Icon:** `text` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add this field for adding text
**Core Mapping:** Text → `AbstractBaseImpl` → FieldType `plain-text`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| value | `_value` | String | null | Direct (HTML-filtered) |

**Dialog Fields:** `./_value` (richtext, label: "Default Value"). Most fields hidden.

**Widget Rendering (JSP):**
- Output: `${guideField.value}` (plain HTML output)
- Edit mode: `<div class="alert_indicator">` with data attributes

---

### GuideSeparator

**Foundation Directory:** `guideseparator`
**Title:** Separator | **Icon:** `separator` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a horizontal line to separate two components
**Core Mapping:** Separator → `AbstractBaseImpl` → FieldType `plain-text` (visual variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| thickness | `thickness` | String | `"1"` | Custom property |

**Dialog Fields:** `./thickness` (numberfield, label: "Thickness (in pixels)")
Most standard fields hidden.

**Widget Rendering:** CSS-based, no widget.jsp — relies on styling.

---

### GuideImage

**Foundation Directory:** `guideimage`
**Title:** Image | **Icon:** `image` | **SuperType:** *(none — custom)*
**Description:** Embed an image from assets or from filesystem
**Core Mapping:** Image → `AbstractBaseImpl` → FieldType `image`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| altText | `altText` | String | `""` (fallback: title or name) | Direct |
| height | `height` | String | `""` | Direct |
| fileReference | `fileReference` | String | null | Direct |
| file | `file` | Binary | null | Direct |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./file` | imageupload | Image |
| `./altText` | textfield | Alternate Text |
| `./visible` | checkbox | Visible |
| `./enabled` | checkbox | Enabled |

---

## Specialized Components

### GuideTermsAndConditions

**Foundation Directory:** `guidetermsandconditions`
**Title:** Terms And Conditions | **Icon:** `stamp` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a field for form authors to specify terms and conditions and checkbox for user agreement
**Core Mapping:** TermsAndConditions → `AbstractFieldImpl` → FieldType `checkbox` (custom variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| tncTextContent | `tncTextContent` | String | null | Custom property |
| linkText | `linkText` | String[] | `[]` | Custom property |
| showLink | `showLink` | Boolean | null | Custom property |
| showApprovalOption | `showApprovalOption` | Boolean | `false` | Custom property |
| showAsPopUp | `showAsPopUp` | Boolean | `false` | Custom property |
| tncCheckBoxContent | `tncCheckBoxContent` | String | null | Custom property |
| assistPriority | `assistPriority` | String | null | Map → screenReaderText |

**Computed Logic:**
- `getShowApprovalOption()`: Returns true if `showAsPopUp` OR `showApprovalOption` is true
- `getScreenReaderText()`: Conditional based on `assistPriority` value (label vs custom)
- `isMandatory()`: Reads from child node `items/tncReviewStatus`

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./tncCheckBoxContent` | textfield | Consent Text |
| `./tncTextContent` | richtext | Content For Terms and Conditions |
| `./showApprovalOption` | checkbox | Show approval options |
| `./showAsPopUp` | checkbox | Show as a pop-up |
| `./showLink` | checkbox | Show link for terms and conditions |
| `./linkText` | multifield | Display Text (format: [DisplayText=Link]) |

**Widget Rendering (JSP):**
- Root: `<div class="GUIDE_FIELD_WIDGET afTermsAndConditions">`
- Branch 1 (`showAsPopUp`): Modal dialog with id `tncDialog_{id}`, modal body, links or text
- Branch 2 (inline): Tabindex container with sr-only content
- If `showApprovalOption`: Checkbox with id `{id}_tncCheckBox`, linked label
- Modal toggle via `data-toggle="modal"`, `aria-label` for screen reader

---

### GuideCaptcha

**Foundation Directory:** `guideCaptcha`
**Title:** CAPTCHA | **Icon:** `shield` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add CAPTCHA validation using AEM CAPTCHA or Google reCAPTCHA service
**Core Mapping:** Captcha → `AbstractFieldImpl` → FieldType `captcha` (custom)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| captchaService | `captchaService` | String | `""` | Custom property |
| rcCloudServicePath | `rcCloudServicePath` | String | null | Custom property |

**Computed Logic:**
- `getCaptchaService()`: Logs error if service is `"afcaptcha"`
- `getExternalDomain()`: Returns overridden domain if service is `"recaptcha"`
- `getAuthoringConfig()`: Sets `"isRecaptchaConfigMissing"` flag

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./mandatoryMessage` | textfield | Validation Message (No Value) |
| `./validateExpMessage` | textfield | Validation Message (Incorrect Value) |
| `./mandatory` | radiogroup | Validate CAPTCHA (on submission vs user action) |
| `./captchaService` | select | CAPTCHA Service (required) |
| `./_reCaptchaScoreBindRef` | textfield | Bind Reference |

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET afCaptchaField">`
- `data-locale`, `data-path`, `data-captchaService`, `data-externalDomain`
- Authoring messages for missing config, hidden label, invisible captcha

---

### GuideChart

**Foundation Directory:** `guidechart`
**Title:** Chart | **Icon:** `graphDonut` | **SuperType:** `fd/af/components/guidefield`
**Description:** Add a chart for visual representation of two-dimensional data
**Core Mapping:** Chart → `AbstractBaseImpl` → FieldType `plain-text` (chart variant)

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| chartType | `chartType` | String | `""` | Custom property |

Chart types: pie, column, donut, bar, line, linepoint, point, area

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./chartType` | select | Chart Type |
| `./repeatableItem` | textfield | Repeating Row or Panel Name |
| `./xAxisTitle` | textfield | X Axis Title |
| `./xExp` | textfield | X Axis Field (required) |
| `./reducerXFunction` | select | X Axis Reducer Function |
| (Plus Y Axis, Series configuration) | | |

**Widget Rendering:** JavaScript widget framework, no traditional JSP.

---

## Derived Components (extend other foundation components)

### GuideEmail

**Foundation Directory:** `guideemail`
**Title:** Email | **Icon:** `email` | **SuperType:** `fd/af/components/guidetextbox`
**Description:** Add a field to capture email address
**Core Mapping:** EmailInput → `AbstractFieldImpl` + `StringConstraint` → FieldType `text-input` (email variant)

**Inherits from:** GuideTextBox (hides multiLine, allowRichText, html5Type)

**Dialog Fields:** Inherits from guidetextbox with these overrides:
- Hidden: `richTextValue`, `allowRichText`, `multiLine`, `html5Type`, `autofillFieldKeyword`, `displayPatternGroup`
- Visible: `validationPatternType`, `validatePictureClause`, `validatePictureClauseMessage`

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET textField guideEmail">`
- `<input type="email">` with autocomplete="email" (or autofillFieldKeyword)
- `maxlength`, `placeholder`, `aria-describedby`

---

### GuideTelephone

**Foundation Directory:** `guidetelephone`
**Title:** Telephone | **Icon:** `devicePhone` | **SuperType:** `fd/af/components/guidetextbox`
**Description:** Add a field to capture telephone number
**Core Mapping:** TelephoneInput → `AbstractFieldImpl` + `StringConstraint` → FieldType `text-input` (tel variant)

**Inherits from:** GuideTextBox (hides allowRichText, html5Type, multiLine, maxChars, minLength, length)

**Dialog Fields:** Inherits from guidetextbox with these overrides:
- Hidden: `allowRichText`, `html5Type`, `multiLine`, `maxChars`, `richTextValue`, `autofillFieldKeyword`, `minLength`, `length`
- Visible: `displayPatternType`, `displayPictureClause`, `validationPatternType`, `validatePictureClause`

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET textField guideTelephone">`
- `<input type="tel">` with autocomplete="tel" (or autofillFieldKeyword)
- `placeholder`, `aria-labelledby`

---

### GuideDateInput

**Foundation Directory:** `guidedateinput`
**Title:** Date Input Field | **Icon:** `dateInput` | **SuperType:** `fd/af/components/guidedatepicker`
**Description:** Add fields to type in a date
**Core Mapping:** DateInput → `AbstractFieldImpl` + `DateConstraint` → FieldType `date-input` (multi-field variant)

**Inherits from:** GuideDatePicker

**Additional JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| dateDisplayFormat | `dateDisplayFormat` | String | (select) | Custom (MM-DD-YYYY, DD-MM-YYYY, YYYY-MM-DD) |
| titleDay | `titleDay` | String | `""` | Custom |
| placeholderDay | `placeholderDay` | String | `""` | Custom |
| titleMonth | `titleMonth` | String | `""` | Custom |
| placeholderMonth | `placeholderMonth` | String | `""` | Custom |
| titleYear | `titleYear` | String | `""` | Custom |
| placeholderYear | `placeholderYear` | String | `""` | Custom |

**Dialog Fields:**

| Field Name | Granite UI Type | Label |
|------------|----------------|-------|
| `./html5Type` | checkbox | Use HTML5 Number Input Type |
| `./_value` | textfield | Default Value (yyyy-mm-dd) |
| `./dateDisplayFormat` | select | Date Format |
| `./titleDay` | textfield | Day Title |
| `./placeholderDay` | textfield | Day Placeholder |
| `./titleMonth` | textfield | Month Title |
| `./placeholderMonth` | textfield | Month Placeholder |
| `./titleYear` | textfield | Year Title |
| `./placeholderYear` | textfield | Year Placeholder |

**Widget Rendering (HTL):**
- Root: `<div class="GUIDE_FIELD_WIDGET guideDateInputWidget" role="group">`
- `data-af-widgetname="dateInputWidget"`, `data-af-widgetoptions` (JSON)
- Three input wrappers (day, month, year) each with `<label>` and `<input type="text|number">`

---

## Container Components

### GuidePanel

**Foundation Directory:** `panel`
**Title:** Panel | **SuperType:** `fd/af/components/guideContainerWrapper`
**Core Mapping:** Panel → `AbstractContainerImpl` → FieldType `panel`

**Hierarchy:** `GuidePanel extends GuideItemsContainer implements Serializable`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| minOccur | `minOccur` | int | `1` | Direct |
| maxOccur | `maxOccur` | int | `1` | Direct |
| initialOccur | `initialOccur` | int | `1` | Custom or drop |
| fragRef | `fragRef` | String | `""` | Custom (fragment reference) |
| longDescription | `longDescription` | String | `""` | Direct |
| optimizeRenderPerformance | `fd:optimizeRenderPerformance` | String | `""` | Drop |

---

### GuideContainer

**Foundation Directory:** `guideContainer`
**Title:** Adaptive Form Container
**Core Mapping:** FormContainer → `AbstractContainerImpl` → FieldType `form`

**Hierarchy:** `GuideContainer extends GuideNode`

**Component-Specific JCR Properties:**

| Property | JCR Name | Type | Default | Core Action |
|----------|----------|------|---------|-------------|
| redirect | `redirect` | String | `""` | Custom |
| dorType | `fd:doRType` | String | `DOR_TYPE_NONE` | Drop (separate concern) |
| themeClientlib | `fd:themeClientlib` | String | `""` | Custom |
| xdpRef | `fd:xdpRef` | String | `""` | Drop (XFA) |
| schemaType | `fd:schemaType` | String | `""` | Direct |
| prefillService | `fd:prefillService` | String | `""` | Custom |
| xsdRef | `xsdRef` | String | `""` | Direct → `schemaRef` |
| autoSaveStrategyType | `autoSaveStrategyType` | String | `""` | Custom |
