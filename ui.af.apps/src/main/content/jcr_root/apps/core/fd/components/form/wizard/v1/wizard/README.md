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
Adaptive Form Wizard (v1)
====
Adaptive Form Wizard component written in HTL.

## Features

* Allows addition of wizard items of varying resource type.
* Ability to force a single panel to be displayed.
* First Item is expanded by default.

### Use Object
The Wizard component uses the `com.adobe.cq.forms.core.components.models.form.Wizard` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Wizard component and are expected to be available as `Resource` properties:

1. `./title` - defines the title shown on the wizard
2. `./name` - defines the component name.

## Client Libraries
The component provides a `core.forms.components.wizard.v1.runtime` client library category that contains a recommended base
CSS styling and JavaScript component. It should be added to a relevant site client library using the `embed` property.

It also provides a `core.wcm.components.wizard.v1.editor.hook` editor hook library  that includes JavaScript
handling for registering wizard in panelContainer registry. It is required for navigation among different components in wizard in the authoring page. 
It is already included by its edit and policy dialogs.


## BEM Description
```
BLOCK cmp-adaptiveform-wizard
    ELEMENT cmp-adaptiveform-wizard__tab
    ELEMENT cmp-adaptiveform-wizard__wizardpanel
    ELEMENT cmp-adaptiveform-wizard__previousNav
    ELEMENT cmp-adaptiveform-wizard__nextNav
    
```

## JavaScript Data Attribute Bindings
Apply a `data-cmp-is="adaptiveFormWizard"` attribute to the wrapper block to enable initialization of the JavaScript component.


### Enabling Wizard Editing Functionality
The following properties and child nodes are required in the proxy component to enable full editing functionality for the Wizard:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Wizard as a container component
2. `./cq:editConfig` - `afterchilddelete`, `afterchildinsert` and `afterchildmove` listeners should be provided via
the edit configuration of the proxy. `_cq_editConfig.xml` contains the recommended actions and can be copied to the proxy component.

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready