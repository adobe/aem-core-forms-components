<!--
Copyright 2026 Adobe

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
Adaptive Form Password Input (v1)
====
Adaptive Form Password input field component written in HTL. It is a thin variant of the
Text Input component: it reuses the `TextInput` Sling Model (`sling:resourceSuperType`
points at `core/fd/components/form/textinput/v1/textinput`) and inherits that component's
dialog, design dialog, and style config, overriding only what differs for a masked field.

## Features

* Renders an `<input type="password">` with an optional show/hide visibility toggle button.
* Custom constraint messages (minLength/maxLength/pattern), same as Text Input.
* Autofill attribute defaults to `new-password`, selectable between `off`, `new-password`,
  and `current-password`.
* Allows replacing this component with other components (as mentioned below).

### Use Object
The Form Password Input component uses the `com.adobe.cq.forms.core.components.models.form.TextInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field (masked in the dialog)
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the field will be read only
9. `./maxLength` / `./minLength` - defines the maximum/minimum length of input allowed for the field
10. `./maxLengthMessage` / `./minLengthMessage` - defines the maximum/minimum length error messages
11. `./pattern` - a regular expression the value must satisfy (e.g. to require a digit and a symbol)
12. `./autocomplete` - the autofill attribute (`off`, `new-password`, `current-password`)
13. `./showHidePassword` - if set to `false`, the show/hide visibility toggle button is not rendered

## Client Libraries
The component reuses the `core.forms.components.textinput.v1.runtime` client library category
for its JavaScript runtime (the same category `textinput`, `emailinput`, and `telephoneinput`
share). It should be added to a relevant site client library using the `embed` property.

It has no dedicated editor client library: the "Formats" tab and the pattern-dropdown-driven
part of the "Validation" tab are hidden/simplified in this component's own dialog, so the
`core.forms.components.textinput.v1.editor` interactive behavior isn't needed here.

### Note on styling the show/hide toggle button
This component only renders the `.cmp-adaptiveform-passwordinput__toggle-visibility` button
element and its accessibility attributes (`aria-pressed`, `aria-label`). It intentionally
ships with **no visual/icon CSS** for that button — consistent with how every other core
form component ships unstyled BEM placeholders. The eye/eye-slash icon artwork is expected
to be supplied by the consuming project's own theme/design system, not by this component.

## BEM Description
```
BLOCK cmp-adaptiveform-passwordinput
    ELEMENT cmp-adaptiveform-passwordinput__label
    ELEMENT cmp-adaptiveform-passwordinput__label-container
    ELEMENT cmp-adaptiveform-passwordinput__widget-wrapper
    ELEMENT cmp-adaptiveform-passwordinput__widget
    ELEMENT cmp-adaptiveform-passwordinput__toggle-visibility
    ELEMENT cmp-adaptiveform-passwordinput__questionmark
    ELEMENT cmp-adaptiveform-passwordinput__shortdescription
    ELEMENT cmp-adaptiveform-passwordinput__longdescription
    ELEMENT cmp-adaptiveform-passwordinput__errormessage
```

## Replace feature:
We support a replace feature that allows replacing this component with any of the below components:

* Button
* Date Picker
* Email Input
* Number Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the password-input component in the form view:
1. `data-cmp-is="adaptiveFormPasswordInput"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
