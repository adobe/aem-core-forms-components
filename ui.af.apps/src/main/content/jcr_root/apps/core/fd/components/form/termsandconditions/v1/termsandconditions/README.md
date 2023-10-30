<!--
Copyright 2023 Adobe

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
Adaptive Form Terms and Conditions (v1)
====
Adaptive Form Terms and Components field component written in HTL.

## Features

* It is composed of Text Field, CheckBox and CheckBox Groups
* Allows to author a Terms & Conditions component with either links or Texts.
* Comes with some OOTB behaviour like
  * Approval Checkbox is not enabled if the text-area is scrollable and user has not scrolled to the bottom
  * Approval Checkbox is not enabled if TnC uses Links and user has not visited all the links

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.TermsAndConditions` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Text component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the filed will be read only
9. `./showApprovalOption` - whether to show the approval checkbox or not
10. `./showLink` - whether to show links instead of Text Content
11. `./showAsPopup` - whether to show the TNC content as a Modal

## Client Libraries
The component provides a `core.forms.components.termsandconditions.v1.runtime` client library category that contains the Javascript runtime for the component.
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.termsandconditions.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-termsandcondition
    ELEMENT cmp-adaptiveform-termsandcondition__label-container
    ELEMENT cmp-adaptiveform-termsandcondition__label
    ELEMENT cmp-adaptiveform-termsandcondition__questionmark
    ELEMENT cmp-adaptiveform-termsandcondition__content-container
      MODIFIER cmp-adaptiveform-termsandcondition__content-container--modal
    ELEMENT cmp-adaptiveform-termsandcondition__body
    ELEMENT cmp-adaptiveform-termsandcondition__header
    ELEMENT cmp-adaptiveform-termsandcondition__close-button
    ELEMENT cmp-adaptiveform-termsandcondition__content
    ELEMENT cmp-adaptiveform-termsandcondition__text
    ELEMENT cmp-adaptiveform-termsandcondition__text .cmp-adaptiveform-text
    ELEMENT cmp-adaptiveform-termsandcondition__text-intersect
    ELEMENT cmp-adaptiveform-termsandcondition__link
    ELEMENT cmp-adaptiveform-termsandcondition__link .cmp-adaptiveform-checkboxgroup 
    ELEMENT cmp-adaptiveform-termsandcondition__approvalcheckbox
    ELEMENT cmp-adaptiveform-termsandcondition__approvalcheckbox .cmp-adaptiveform-checkbox
    ELEMENT cmp-adaptiveform-termsandcondition__shortdescription
    ELEMENT cmp-adaptiveform-termsandcondition__longdescription
    ELEMENT cmp-adaptiveform-termsandcondition__errormessage
```



## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the text-input component in the form view:
1. `data-cmp-is="adaptiveFormTermsAndConditions"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`
3. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
4. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
