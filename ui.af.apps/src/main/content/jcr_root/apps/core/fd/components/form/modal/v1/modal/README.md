<!--
Copyright 2024 Adobe

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
Adaptive Form Modal (v1)
====

## Introduction

The Modal component is a part of the Adobe Forms Core Components library. It provides a dialog box or popup window that is displayed on top of the current page.

## Features

- Display content in a layer above the current page
- Close the modal when the Escape key is pressed
- Make the background inactive when the modal is open

### Edit Dialog Properties
The following properties are written to JCR for this Form Panel component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./description` - defines a help message that can be rendered in the field as a hint for the user
5. `./readOnly` - if set to `true`, the filed will be read only


## Client Libraries
The component provides a `core.forms.components.modal.v1.runtime` client library category that contains the Javascript runtime for the component.
It should be added to a relevant site client library using the `embed` property.


## BEM Description
```
BLOCK cmp-adaptiveform-modal
    ELEMENT cmp-adaptiveform-modal__dialog
    ELEMENT cmp-adaptiveform-modal__panel-container
    MODIFIER cmp-adaptiveform-modal__panel-container--hidden
    ELEMENT cmp-adaptiveform-modal__overlay
    ELEMENT cmp-adaptiveform-modal__label-container
    ELEMENT cmp-adaptiveform-modal__label
    ELEMENT cmp-adaptiveform-modal__questionmark
    ELEMENT cmp-adaptiveform-modal__shortdescription
    ELEMENT cmp-adaptiveform-modal__longdescription
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the text-input component in the form view:
1. `data-cmp-is="adaptiveFormModal"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
