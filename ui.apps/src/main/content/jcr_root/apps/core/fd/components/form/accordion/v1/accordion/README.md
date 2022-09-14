<!--
Copyright 2019 Adobe

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

### Component Policy Configuration Properties
The following configuration properties are used:

[comment]: <> (1. Heading is not available in forms)

[comment]: <> (1. `./allowedHeadingElements` - the heading elements &#40;`h2` - `h6`, `h1` is omitted for SEO reasons&#41; that are allowed to be selected in the edit dialog.)

[comment]: <> (2. `./headingElement` - the default heading element &#40;`h2` - `h6`, `h1` is omitted for SEO reasons&#41; to use for the accordion headers.)

It is also possible to define the allowed components for the Accordion.

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

[comment]: <> (The default Accordion site Client Library provides a handler for message requests between the editor and the Accordion.)

[comment]: <> (If the built-in Client Library is not used, a message request handler should be registered:)

[comment]: <> (```)

[comment]: <> (new Granite.author.MessageChannel&#40;"cqauthor", window&#41;.subscribeRequestMessage&#40;"cmp.panelcontainer", function&#40;message&#41; {)

[comment]: <> (    if &#40;message.data && message.data.type === "cmp-accordion" && message.data.id === myAccordionHTMLElement.dataset["cmpPanelcontainerId"]&#41; {)

[comment]: <> (        if &#40;message.data.operation === "navigate"&#41; {)

[comment]: <> (            // handle navigation)

[comment]: <> (        })

[comment]: <> (    })

[comment]: <> (}&#41;;)

[comment]: <> (```)

[comment]: <> (The handler should subscribe to a `cmp.panelcontainer` message that allows routing of a `navigate` operation to ensure)

[comment]: <> (that the UI component is updated when the active item is switched in the editor layer.)

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready