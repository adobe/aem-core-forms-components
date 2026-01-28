<!--
Copyright 2025 Adobe

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
Adaptive Form CheckBox Group (v2)
====
Adaptive Form CheckBox Group component written in HTL.

## Features

* Provides the following type of input:
  * checkbox
* Custom constraint messages for the above types
* Styles
* Enhanced semantic HTML structure with `<fieldset>` and `<legend>` for improved accessibility
* Inherits all functionality from v1

### Use Object
The Form CheckBox Group component uses the `com.adobe.cq.forms.core.components.models.form.CheckBoxGroup` Sling Model for its Use-object.

### What's New in v2

Version 2 of the CheckBox Group component introduces several improvements focused on **semantic HTML** and **accessibility** while maintaining backward compatibility with v1.

#### Key Changes from v1

**1. Semantic HTML Structure**
- **Container Element**: Changed from `<div>` to `<fieldset>` for proper grouping of related form controls
- **Label Element**: Changed from `<div>` with label class to semantic `<legend>` element
- **BEM Modifier**: Added `cmp-adaptiveform-checkboxgroup--v2` class for version-specific styling

**2. Accessibility Improvements**
- Uses native `<fieldset>` and `<legend>` elements which provide better screen reader support
- Improved semantic structure for assistive technologies
- Better keyboard navigation support through proper HTML5 form grouping
- Removed redundant `aria-label` from individual checkbox inputs (line 28 in widget.html) as the legend provides group context

**3. Architecture**
- **Inheritance**: v2 extends v1 via `sling:resourceSuperType="core/fd/components/form/checkboxgroup/v1/checkboxgroup"`
- **No Dialog/Template**: v2 reuses v1's `_cq_dialog` and `_cq_template.xml` - no duplication needed
- **No Editor Clientlibs**: Editor functionality inherited from v1
- **No Custom CSS**: v2 relies on v1's CSS, only adds version-specific modifier class
- **JavaScript**: Uses the same `checkboxgroupview.js` from v1

**4. Minimal Changes, Maximum Impact**
The v2 component demonstrates a focused improvement strategy:
- Only modified the HTL markup (`checkboxgroup.html` and `widget.html`)
- Maintained complete functional compatibility with v1
- No breaking changes to the data model or JavaScript behavior
- Authors can upgrade from v1 to v2 seamlessly

#### Comparison Table

| Aspect | v1 | v2 |
|--------|----|----|
| Container Element | `<div>` | `<fieldset>` |
| Label Element | `<div>` with label class | `<legend>` |
| BEM Modifier | None | `cmp-adaptiveform-checkboxgroup--v2` |
| Dialog | Own `_cq_dialog` | Inherited from v1 |
| Template | Own `_cq_template.xml` | Inherited from v1 |
| Editor Clientlibs | Yes | Inherited from v1 |
| CSS Files | Yes | Inherited from v1 |
| JavaScript | `checkboxgroupview.js` | Same file reused |
| Accessibility | Good | Enhanced with semantic HTML |
| Widget aria-label | Yes (on each checkbox) | No (legend provides context) |

### Edit Dialog Properties
The following properties are written to JCR for this Form CheckBox Group component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the filed will be read only
9. `./type` - defines the data type of the value
10. `./enum` - defines the set of possible values for this field
11. `./enumNames` - defines the user-friendly text to display for the possible options of the field.

## Client Libraries
The component provides a `core.forms.components.checkboxgroup.v2.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

**Note**: v2 does not provide editor client libraries as it inherits editor functionality from v1.

## BEM Description
```
BLOCK cmp-adaptiveform-checkboxgroup
    MOD cmp-adaptiveform-checkboxgroup--v2
    ELEMENT cmp-adaptiveform-checkboxgroup__label
    ELEMENT cmp-adaptiveform-checkboxgroup__label-container
    ELEMENT cmp-adaptiveform-checkboxgroup__widget
    ELEMENT cmp-adaptiveform-checkbox__widget
    ELEMENT cmp-adaptiveform-checkbox__label
    ELEMENT cmp-adaptiveform-checkboxgroup__questionmark
    ELEMENT cmp-adaptiveform-checkboxgroup__shortdescription
    ELEMENT cmp-adaptiveform-checkboxgroup__longdescription
    ELEMENT cmp-adaptiveform-checkboxgroup__errormessage
```

### Note
The `<legend>` element in v2 serves the same purpose as the label container in v1, but provides better semantic meaning and accessibility. The `cmp-adaptiveform-checkboxgroup__label-container` class is applied to the `<legend>` element to maintain CSS compatibility.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the checkbox-group component in the form view:  
1. `data-cmp-is="adaptiveFormCheckBoxGroup"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not

## Replace Feature
We support replace feature that allows replacing CheckBox Group component to any of the below components:

* Drop Down
* Radio Button

## Migration from v1 to v2

Migrating from v1 to v2 is straightforward:

1. **No Data Model Changes**: The underlying data model is identical
2. **No JavaScript Changes**: All client-side behavior remains the same
3. **No Dialog Changes**: Author experience is unchanged
4. **CSS Compatibility**: Existing styles will work; optionally target `.cmp-adaptiveform-checkboxgroup--v2` for version-specific styling
5. **Accessibility Benefits**: Immediate improvement in screen reader support through semantic HTML

**Recommendation**: New projects should use v2 for better accessibility. Existing v1 implementations can be upgraded when convenient without risk of breaking changes.

## Information
* **Vendor**: Adobe
* **Version**: v2
* **Compatibility**: Cloud
* **Status**: production-ready
