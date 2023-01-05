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
Tabs (v1)
====
Adaptive Form Tabs component written in HTL.

## Features

* Allows addition of tab items of varying resource type.
* Allowed components can be configured through policy configuration.
* Ability to force a single panel to be displayed.
* First tab is selected by default.

### Use Object
The Tabs component uses the `com.adobe.cq.forms.core.components.models.form.Panel` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Panel Container component and are expected to be available as `Resource` properties:
The following properties are written to JCR for this Accordion component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this panel
2. `./name` - defines the name of the panel, which will be submitted with the form data
3. `./layout` - defines the layout type, either `simple` (default) or `responsiveGrid`; if no value is defined, the component will fallback to the value defined by the component's policy
4. `./bindref` - defines the data binding, and how data will be sent
5. `./visible` - defines initial state of panel visibility
6. `./enabled` - defines initial state of panel if its enabled or not
7. `./tooltip` - defines tooltip on panel title
8. `./description` - defines a help message that can be rendered in the field as a hint for the user

## BEM Description
```
BLOCK cmp-tabs
    ELEMENT cmp-tabs__it
    ELEMENT cmp-tabs__tablist
    ELEMENT cmp-tabs__tab
        MOD cmp-tabs__tab--active
    ELEMENT cmp-tabs__title
    ELEMENT cmp-tabs__icon
    ELEMENT cmp-tabs__label
    ELEMENT cmp-tabs__shortdescription
    ELEMENT cmp-tabs__longdescription
    ELEMENT cmp-tabs__questionmark
```
## Client Libraries
The component provides a `core.forms.components.tabs.v1.runtime` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the horizontal-tabs component in the form view:
1. `data-cmp-is="adaptiveFormTabs"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

### Enabling Editing Functionality
The following property is required in the proxy component to enable full editing functionality for the Panel Container:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Panel Container as a container component

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

