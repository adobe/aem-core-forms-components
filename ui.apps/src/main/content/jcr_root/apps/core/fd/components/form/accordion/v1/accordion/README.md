<!--
Copyright 2022 Adobe

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
Adaptive Form Accordion (v1)
====
Adaptive Form Accordion component written in HTL.

## Features

* Allows addition of accordion items of varying resource type.
* Allowed components can be configured through policy configuration.
* Toggle accordion panels from accordion header controls.
* Ability to force a single panel to be displayed.
* First Item is expanded by default.

### Use Object
The Accordion component uses the `com.adobe.cq.forms.core.components.models.form.Accordion` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Accordion component and are expected to be available as `Resource` properties:

1. `./description` - defines a help message that can be rendered in the field as a hint for the user
2. `./id` - defines the component HTML ID attribute.

## Client Libraries
The component provides a `core.forms.components.accordian.v1` client library category that contains a recommended base
CSS styling and JavaScript component. It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.accordian.v1.editor` editor client library category that includes JavaScript
handling for dialog interaction. It is already included by its edit and policy dialogs.

## BEM Description
```
BLOCK cmp-accordion
    ELEMENT cmp-accordion__item
    ELEMENT cmp-accordion__header
    ELEMENT cmp-accordion__button
        MOD cmp-accordion__button--expanded
    ELEMENT cmp-accordion__title
    ELEMENT cmp-accordion__icon
    ELEMENT cmp-accordion__panel
        MOD cmp-accordion__panel--expanded
        MOD cmp-accordion__panel--hidden
```

## JavaScript Data Attribute Bindings
Apply a `data-cmp-is="adaptiveFormAccordion"` attribute to the wrapper block to enable initialization of the JavaScript component.

The following attributes can be added to the same element to provide options:

```
data-cmp-hook-accordion="item"
data-cmp-hook-accordion="button"
data-cmp-hook-accordion="panel"
```

### Enabling Accordion Editing Functionality
The following properties and child nodes are required in the proxy component to enable full editing functionality for the Accordion:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Accordion as a container component
2. `./cq:editConfig` - `afterchilddelete`, `afterchildinsert` and `afterchildmove` listeners should be provided via
the edit configuration of the proxy. `_cq_editConfig.xml` contains the recommended actions and can be copied to the proxy component.

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready