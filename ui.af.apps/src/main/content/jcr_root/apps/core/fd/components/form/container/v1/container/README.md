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
Adaptive Form Container (v1)
====
Adaptive Form container written in HTL.

## Features
* Form submit actions like sending emails, submit to rest end point
* Thank you page
* Thank you message
* Ability to select form model definition as a dam asset

### Use Object
The Adaptive Form Container component uses the `com.adobe.cq.forms.core.components.models.form.FormContainer` Sling Model for its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./components` - defines the allowed components that can be dropped onto a Form Container associated to this component policy

### Edit Dialog Properties

The following properties are written to JCR by the Edit Dialog and consumed by the Sling Model.

> **Important**: In the runtime JSON model, auto-save properties are grouped under the `fd:autoSave` key
> and submission properties under `fd:submit`. These are output-time groupings only — JCR stores all
> of them as flat properties directly on this FormContainer node.

#### Inherited container properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Visible | `./visible` | Boolean | `true` | Whether the container is visible |
| Enabled | `./enabled` | Boolean | `true` | Whether the container is enabled |
| Title | `./title` | String | — | Form title |
| Description | `./description` | String | — | Form description |

#### Submission properties (flat JCR, grouped under `fd:submit` in JSON output)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Action type | `./actionType` | String | — | Submit action type |
| Action name | `./actionName` | String | — | Submit action name |
| Email To | `./mailto` | String | — | Recipient email address(es) |
| Email From | `./from` | String | — | Sender email address |
| Email Subject | `./subject` | String | — | Email subject line |
| Email CC | `./cc` | String | — | CC email address(es) |
| Email BCC | `./bcc` | String | — | BCC email address(es) |
| Spreadsheet URL | `./spreadsheetUrl` | String | — | OneDrive/SharePoint spreadsheet URL |

#### Post-submission properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Thank you message (v1) | `./thankyouMessage` | String | — | Message shown after submit (lowercase y) |

#### Legacy / DAM-based form model

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Form model document path | `./formModelDocumentPath` | String | — | Path to DAM asset containing form JSON definition |

## Client Libraries

The component provides a `core.forms.components.container.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-formcontainer
    ELEMENT cmp-formcontainer__content
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="formcontainer"` attribute to the `cmp-formcontainer` block to enable initialization of the JavaScript component.